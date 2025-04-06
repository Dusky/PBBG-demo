/**
 * Spawn Service for Fantasy Text MMORPG
 * Handles spawning of monsters and items in game zones
 */

const Zone = require('../models/Zone');
const Monster = require('../models/Monster');
const Item = require('../models/Item');

class SpawnService {
  constructor(gameState) {
    this.gameState = gameState;
    this.spawnedMonsters = new Map(); // Map of zone ID to spawned monsters list
    this.spawnedItems = new Map(); // Map of zone ID to spawned items list
    this.monsterTimers = new Map(); // Map of monster instance ID to respawn timers
  }

  /**
   * Initialize spawn service and set up initial spawns
   */
  async initialize() {
    try {
      const zones = await Zone.find();
      
      for (const zone of zones) {
        await this.initializeZoneSpawns(zone._id);
      }
      
      console.log('Spawn service initialized.');
    } catch (error) {
      console.error('Error initializing spawn service:', error);
    }
  }

  /**
   * Initialize spawns for a specific zone
   * @param {string} zoneId - The zone ID
   */
  async initializeZoneSpawns(zoneId) {
    try {
      const zone = await Zone.findById(zoneId);
      if (!zone) return;

      // Create empty spawn arrays for the zone if they don't exist
      if (!this.spawnedMonsters.has(zoneId)) {
        this.spawnedMonsters.set(zoneId, []);
      }
      
      if (!this.spawnedItems.has(zoneId)) {
        this.spawnedItems.set(zoneId, []);
      }

      // Spawn initial monsters based on the zone's monster types
      if (zone.monsters && zone.monsters.length > 0) {
        const monsterSpawns = await this.spawnZoneMonsters(zone);
        console.log(`Spawned ${monsterSpawns.length} monsters in zone: ${zone.name}`);
      }

      // Spawn initial items
      if (zone.resources && zone.resources.length > 0) {
        const itemSpawns = await this.spawnZoneItems(zone);
        console.log(`Spawned ${itemSpawns.length} items in zone: ${zone.name}`);
      }
    } catch (error) {
      console.error(`Error initializing spawns for zone ${zoneId}:`, error);
    }
  }

  /**
   * Spawn monsters in a zone based on zone monster definitions
   * @param {object} zone - The zone object
   * @returns {array} - Array of spawned monster instances
   */
  async spawnZoneMonsters(zone) {
    try {
      const zoneMonsters = [];
      
      // Get existing monsters for this zone
      const existingMonsters = this.spawnedMonsters.get(zone._id.toString()) || [];
      
      // For each monster type in the zone
      for (const monsterType of zone.monsters) {
        const monsterDb = await Monster.findOne({ id: monsterType });
        
        if (!monsterDb) continue;
        
        // Determine how many to spawn (use a random number within a range)
        const count = this.getRandomSpawnCount(monsterType.minCount || 1, monsterType.maxCount || 3);
        
        for (let i = 0; i < count; i++) {
          const spawnedMonster = this.createMonsterInstance(monsterDb, zone._id);
          
          // Add to our list of spawned monsters for this zone
          existingMonsters.push(spawnedMonster);
          zoneMonsters.push(spawnedMonster);
          
          // If this is a boss monster, ensure only one can exist
          if (monsterDb.isBoss) break;
        }
      }
      
      // Update the spawned monsters map for this zone
      this.spawnedMonsters.set(zone._id.toString(), existingMonsters);
      
      return zoneMonsters;
    } catch (error) {
      console.error(`Error spawning monsters for zone ${zone.name}:`, error);
      return [];
    }
  }

  /**
   * Create a monster instance from a monster template
   * @param {object} monsterTemplate - The monster database document
   * @param {string} zoneId - The zone ID where the monster is spawned
   * @returns {object} - The monster instance object
   */
  createMonsterInstance(monsterTemplate, zoneId) {
    const instanceId = `${monsterTemplate._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      instanceId,
      monsterId: monsterTemplate._id,
      id: monsterTemplate.id,
      name: monsterTemplate.name,
      description: monsterTemplate.description,
      level: monsterTemplate.level,
      type: monsterTemplate.type,
      aggression: monsterTemplate.aggression,
      attributes: { ...monsterTemplate.attributes },
      stats: {
        currentHealth: monsterTemplate.stats.maxHealth,
        currentMana: monsterTemplate.stats.maxMana,
        ...monsterTemplate.stats
      },
      abilities: [...monsterTemplate.abilities],
      loot: [...monsterTemplate.loot],
      experienceValue: monsterTemplate.experienceValue,
      goldValue: monsterTemplate.goldValue,
      isBoss: monsterTemplate.isBoss,
      respawnTime: monsterTemplate.respawnTime,
      isAlive: true,
      zoneId,
      lastCombatTime: null,
      target: null,
      spawnedAt: Date.now()
    };
  }

  /**
   * Spawn items in a zone based on zone resource definitions
   * @param {object} zone - The zone object
   * @returns {array} - Array of spawned item instances
   */
  async spawnZoneItems(zone) {
    try {
      const zoneItems = [];
      
      // Get existing items for this zone
      const existingItems = this.spawnedItems.get(zone._id.toString()) || [];
      
      // For each resource type in the zone
      for (const resource of zone.resources) {
        const itemDb = await Item.findOne({ id: resource.itemId });
        
        if (!itemDb) continue;
        
        // Determine how many to spawn
        const count = this.getRandomSpawnCount(resource.minCount || 1, resource.maxCount || 3);
        
        for (let i = 0; i < count; i++) {
          const spawnedItem = this.createItemInstance(itemDb, zone._id);
          
          // Add to our list of spawned items for this zone
          existingItems.push(spawnedItem);
          zoneItems.push(spawnedItem);
        }
      }
      
      // Update the spawned items map for this zone
      this.spawnedItems.set(zone._id.toString(), existingItems);
      
      return zoneItems;
    } catch (error) {
      console.error(`Error spawning items for zone ${zone.name}:`, error);
      return [];
    }
  }

  /**
   * Create an item instance from an item template
   * @param {object} itemTemplate - The item database document
   * @param {string} zoneId - The zone ID where the item is spawned
   * @returns {object} - The item instance object
   */
  createItemInstance(itemTemplate, zoneId) {
    const instanceId = `${itemTemplate._id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      instanceId,
      itemId: itemTemplate._id,
      id: itemTemplate.id,
      name: itemTemplate.name,
      description: itemTemplate.description,
      type: itemTemplate.type,
      subType: itemTemplate.subType,
      rarity: itemTemplate.rarity,
      level: itemTemplate.level,
      value: itemTemplate.value,
      quantity: 1, // Default quantity
      zoneId,
      spawnedAt: Date.now(),
      despawnTime: Date.now() + (3600 * 1000) // Items despawn after 1 hour by default
    };
  }

  /**
   * Calculate a random spawn count within a range
   * @param {number} min - Minimum spawn count
   * @param {number} max - Maximum spawn count
   * @returns {number} - Random spawn count
   */
  getRandomSpawnCount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Handle monster death and schedule respawn
   * @param {object} monster - The monster instance that died
   * @param {string} killedBy - ID of the player who killed the monster
   */
  handleMonsterDeath(monster, killedBy) {
    try {
      const zoneId = monster.zoneId.toString();
      const zoneMonsters = this.spawnedMonsters.get(zoneId) || [];
      
      // Find the monster in our list
      const monsterIndex = zoneMonsters.findIndex(m => m.instanceId === monster.instanceId);
      
      if (monsterIndex >= 0) {
        // Mark monster as not alive
        zoneMonsters[monsterIndex].isAlive = false;
        zoneMonsters[monsterIndex].killedBy = killedBy;
        zoneMonsters[monsterIndex].killedAt = Date.now();
        
        // Update the zone monsters
        this.spawnedMonsters.set(zoneId, zoneMonsters);
        
        // Schedule respawn if needed
        if (monster.respawnTime > 0) {
          console.log(`Scheduling respawn for monster ${monster.name} in ${monster.respawnTime} seconds.`);
          
          const timerId = setTimeout(() => {
            this.respawnMonster(monster, zoneId);
          }, monster.respawnTime * 1000);
          
          // Store the timer ID
          this.monsterTimers.set(monster.instanceId, timerId);
        } else {
          // If no respawn time, remove from the list
          this.spawnedMonsters.set(
            zoneId, 
            zoneMonsters.filter(m => m.instanceId !== monster.instanceId)
          );
        }
        
        // Generate loot
        return this.generateMonsterLoot(monster);
      }
      
      return null;
    } catch (error) {
      console.error('Error handling monster death:', error);
      return null;
    }
  }

  /**
   * Respawn a monster
   * @param {object} deadMonster - The dead monster instance
   * @param {string} zoneId - The zone ID
   */
  async respawnMonster(deadMonster, zoneId) {
    try {
      const monsterDb = await Monster.findById(deadMonster.monsterId);
      
      if (!monsterDb) return;
      
      // Create a new instance
      const newMonster = this.createMonsterInstance(monsterDb, zoneId);
      
      // Get current monsters for zone
      const zoneMonsters = this.spawnedMonsters.get(zoneId) || [];
      
      // Remove the dead monster and add the new one
      const updatedMonsters = zoneMonsters
        .filter(m => m.instanceId !== deadMonster.instanceId)
        .concat(newMonster);
      
      // Update monsters for zone
      this.spawnedMonsters.set(zoneId, updatedMonsters);
      
      // Clean up timer
      this.monsterTimers.delete(deadMonster.instanceId);
      
      console.log(`Monster ${newMonster.name} respawned in zone ${zoneId}`);
      
      // Notify the game state so it can inform players
      if (this.gameState) {
        this.gameState.notifyZoneUpdate(zoneId, {
          type: 'monster_spawn',
          monster: {
            instanceId: newMonster.instanceId,
            id: newMonster.id,
            name: newMonster.name,
            level: newMonster.level,
            type: newMonster.type,
            isAlive: true
          }
        });
      }
    } catch (error) {
      console.error('Error respawning monster:', error);
    }
  }

  /**
   * Generate loot from a killed monster
   * @param {object} monster - The monster that was killed
   * @returns {array} - Array of item instances dropped as loot
   */
  async generateMonsterLoot(monster) {
    try {
      const lootItems = [];
      
      // Always drop gold if the monster has a gold value
      if (monster.goldValue > 0) {
        // Vary the gold value a bit
        const goldVariation = 0.2; // 20% variation
        const minGold = Math.round(monster.goldValue * (1 - goldVariation));
        const maxGold = Math.round(monster.goldValue * (1 + goldVariation));
        const goldDropped = Math.floor(Math.random() * (maxGold - minGold + 1)) + minGold;
        
        lootItems.push({
          instanceId: `gold_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          id: 'gold',
          name: 'Gold',
          value: goldDropped,
          type: 'currency',
          quantity: goldDropped,
          spawnedAt: Date.now(),
          despawnTime: Date.now() + (300 * 1000) // Gold despawns after 5 minutes
        });
      }
      
      // Process the monster's loot table
      if (monster.loot && monster.loot.length > 0) {
        for (const lootEntry of monster.loot) {
          // Check if this item drops (based on chance)
          const roll = Math.random() * 100;
          
          if (roll <= lootEntry.chance) {
            // Find the item definition
            const itemDb = await Item.findOne({ id: lootEntry.itemId });
            
            if (itemDb) {
              // Create the item instance
              const itemInstance = this.createItemInstance(itemDb, monster.zoneId);
              
              // Set quantity if specified in loot table
              if (lootEntry.minQuantity && lootEntry.maxQuantity) {
                const quantity = Math.floor(Math.random() * (lootEntry.maxQuantity - lootEntry.minQuantity + 1)) + lootEntry.minQuantity;
                itemInstance.quantity = quantity;
              }
              
              // Add to loot items
              lootItems.push(itemInstance);
              
              // Add to the zone's dropped items
              const zoneItems = this.spawnedItems.get(monster.zoneId.toString()) || [];
              zoneItems.push(itemInstance);
              this.spawnedItems.set(monster.zoneId.toString(), zoneItems);
            }
          }
        }
      }
      
      return lootItems;
    } catch (error) {
      console.error('Error generating monster loot:', error);
      return [];
    }
  }

  /**
   * Get all live monsters in a zone
   * @param {string} zoneId - The zone ID
   * @returns {array} - Array of live monster instances
   */
  getZoneMonsters(zoneId) {
    const monsters = this.spawnedMonsters.get(zoneId.toString()) || [];
    // Return only alive monsters with reduced information for client
    return monsters
      .filter(m => m.isAlive)
      .map(m => ({
        instanceId: m.instanceId,
        id: m.id,
        name: m.name,
        level: m.level,
        type: m.type,
        stats: {
          currentHealth: m.stats.currentHealth,
          maxHealth: m.stats.maxHealth
        },
        isBoss: m.isBoss,
        isAlive: m.isAlive
      }));
  }

  /**
   * Get all items in a zone
   * @param {string} zoneId - The zone ID
   * @returns {array} - Array of item instances
   */
  getZoneItems(zoneId) {
    const items = this.spawnedItems.get(zoneId.toString()) || [];
    const now = Date.now();
    
    // Filter out despawned items and return list
    return items
      .filter(item => item.despawnTime > now)
      .map(item => ({
        instanceId: item.instanceId,
        id: item.id,
        name: item.name,
        type: item.type,
        subType: item.subType,
        rarity: item.rarity,
        quantity: item.quantity
      }));
  }

  /**
   * Get a specific monster by instance ID
   * @param {string} instanceId - The monster instance ID
   * @returns {object|null} - The monster instance or null if not found
   */
  getMonsterByInstanceId(instanceId) {
    for (const [_, monsters] of this.spawnedMonsters.entries()) {
      const monster = monsters.find(m => m.instanceId === instanceId);
      if (monster) return monster;
    }
    return null;
  }

  /**
   * Get a specific item by instance ID
   * @param {string} instanceId - The item instance ID
   * @returns {object|null} - The item instance or null if not found
   */
  getItemByInstanceId(instanceId) {
    for (const [_, items] of this.spawnedItems.entries()) {
      const item = items.find(i => i.instanceId === instanceId);
      if (item) return item;
    }
    return null;
  }

  /**
   * Remove an item from the zone (when it's collected by a player)
   * @param {string} instanceId - The item instance ID
   * @returns {object|null} - The collected item or null if not found
   */
  collectItem(instanceId) {
    for (const [zoneId, items] of this.spawnedItems.entries()) {
      const itemIndex = items.findIndex(i => i.instanceId === instanceId);
      
      if (itemIndex >= 0) {
        // Remove the item from the zone
        const collectedItem = items[itemIndex];
        const updatedItems = items.filter((_, idx) => idx !== itemIndex);
        this.spawnedItems.set(zoneId, updatedItems);
        
        return collectedItem;
      }
    }
    
    return null;
  }

  /**
   * Update monster stats (e.g., during combat)
   * @param {string} instanceId - The monster instance ID
   * @param {object} updates - The updates to apply
   * @returns {object|null} - Updated monster or null if not found
   */
  updateMonster(instanceId, updates) {
    for (const [zoneId, monsters] of this.spawnedMonsters.entries()) {
      const monsterIndex = monsters.findIndex(m => m.instanceId === instanceId);
      
      if (monsterIndex >= 0) {
        // Update the monster
        const updatedMonster = { ...monsters[monsterIndex], ...updates };
        
        // If updating stats, make sure we merge properly
        if (updates.stats) {
          updatedMonster.stats = { ...monsters[monsterIndex].stats, ...updates.stats };
        }
        
        // Update the monster in our list
        monsters[monsterIndex] = updatedMonster;
        this.spawnedMonsters.set(zoneId, monsters);
        
        return updatedMonster;
      }
    }
    
    return null;
  }
}

module.exports = SpawnService; 
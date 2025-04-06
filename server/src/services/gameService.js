const Player = require('../models/Player');
const Monster = require('../models/Monster');
const Zone = require('../models/Zone');
const Item = require('../models/Item');
const SpawnService = require('./spawnService');

// Player actions
const playerActions = {
  // Move player to a different zone
  async movePlayer(playerId, destinationZone) {
    try {
      const player = await Player.findById(playerId);
      const zone = await Zone.findOne({ name: destinationZone });
      
      if (!player || !zone) {
        return { success: false, message: 'Player or zone not found' };
      }
      
      // Check if the destination zone is connected to current zone
      const currentZone = await Zone.findOne({ name: player.character.currentZone });
      
      if (currentZone) {
        const connection = currentZone.connections.find(
          conn => conn.zoneName === destinationZone
        );
        
        if (!connection) {
          return { success: false, message: 'You cannot travel to that zone from here' };
        }
        
        // Check level requirement
        if (player.character.level < connection.requiredLevel) {
          return { 
            success: false, 
            message: `You need to be level ${connection.requiredLevel} to enter this zone` 
          };
        }
        
        // Check item requirement
        if (connection.requiredItem) {
          const hasItem = player.character.inventory.some(
            item => item.itemId.toString() === connection.requiredItem.toString()
          );
          
          if (!hasItem) {
            return { success: false, message: 'You need a specific item to enter this zone' };
          }
        }
      }
      
      // Update player zone
      player.character.currentZone = zone.name;
      await player.save();
      
      return { 
        success: true, 
        message: `You have entered ${zone.displayName}`,
        zone: {
          name: zone.name,
          displayName: zone.displayName,
          description: zone.description,
          connections: zone.connections.map(conn => ({
            direction: conn.direction,
            description: conn.description,
            zoneName: conn.zoneName
          }))
        }
      };
    } catch (error) {
      console.error('Move player error:', error);
      return { success: false, message: 'Error moving player' };
    }
  },
  
  // Combat logic
  async attackMonster(playerId, monsterId) {
    try {
      const player = await Player.findById(playerId);
      const monster = await Monster.findById(monsterId);
      
      if (!player || !monster) {
        return { success: false, message: 'Player or monster not found' };
      }
      
      // Calculate player damage
      const playerDamage = calculateDamage(
        player.character.attributes.strength,
        10, // Base min damage
        20  // Base max damage
      );
      
      // Apply damage to monster
      monster.stats.health.current -= playerDamage;
      
      const result = {
        success: true,
        playerDamage,
        message: `You hit the ${monster.name} for ${playerDamage} damage!`
      };
      
      // Check if monster is defeated
      if (monster.stats.health.current <= 0) {
        result.monsterDefeated = true;
        result.message += ` You have defeated the ${monster.name}!`;
        
        // Calculate experience and gold rewards
        const expGained = monster.experienceValue;
        const goldGained = Math.floor(
          Math.random() * (monster.goldValue.max - monster.goldValue.min + 1) + monster.goldValue.min
        );
        
        // Apply rewards to player
        player.character.experience += expGained;
        
        // Check for level up
        if (player.character.experience >= calculateExpForNextLevel(player.character.level)) {
          player.character.level += 1;
          player.character.experience = 0;
          result.levelUp = true;
          result.message += ` You gained a level! You are now level ${player.character.level}.`;
        }
        
        // Drop items
        const droppedItems = [];
        for (const loot of monster.loot) {
          if (Math.random() <= loot.dropRate) {
            const quantity = Math.floor(
              Math.random() * (loot.maxQuantity - loot.minQuantity + 1) + loot.minQuantity
            );
            
            // Add item to player inventory
            player.character.inventory.push({
              itemId: loot.itemId,
              quantity
            });
            
            // Get item details
            const item = await Item.findById(loot.itemId);
            if (item) {
              droppedItems.push({
                name: item.name,
                quantity
              });
            }
          }
        }
        
        result.rewards = {
          experience: expGained,
          gold: goldGained,
          items: droppedItems
        };
        
        await player.save();
      } else {
        // Monster attacks back
        const monsterDamage = calculateDamage(
          monster.attributes.strength,
          monster.stats.damage.min,
          monster.stats.damage.max
        );
        
        // Apply damage to player
        player.character.health.current -= monsterDamage;
        player.character.health.current = Math.max(0, player.character.health.current);
        
        result.monsterDamage = monsterDamage;
        result.message += ` The ${monster.name} hits you for ${monsterDamage} damage!`;
        
        // Check if player is defeated
        if (player.character.health.current <= 0) {
          result.playerDefeated = true;
          result.message += ' You have been defeated!';
          
          // Apply death penalty
          player.character.health.current = Math.floor(player.character.health.max * 0.5);
          
          if (player.character.experience > 0) {
            player.character.experience = Math.floor(player.character.experience * 0.9);
            result.message += ' You lost some experience.';
          }
        }
        
        await player.save();
        await monster.save();
      }
      
      return result;
    } catch (error) {
      console.error('Attack monster error:', error);
      return { success: false, message: 'Error processing combat' };
    }
  }
};

// Combat utility functions
function calculateMaxHealth(level, vitality) {
  const baseHealth = 100; // Base health for level 1
  const levelBonus = (level - 1) * 10; // +10 HP per level
  const vitBonus = vitality * 5; // +5 HP per VIT point
  
  return baseHealth + levelBonus + vitBonus;
}

function calculateMaxMana(level, intelligence, wisdom) {
  const baseMana = 50; // Base mana for level 1
  const levelBonus = (level - 1) * 5; // +5 mana per level
  const intBonus = intelligence * 3; // +3 mana per INT
  const wisBonus = wisdom * 2; // +2 mana per WIS
  
  return baseMana + levelBonus + intBonus + wisBonus;
}

function calculateCritChance(dexterity) {
  // 0.5% crit chance per DEX point, capped at 25%
  return Math.min(0.25, dexterity * 0.005);
}

function calculateDodgeChance(dexterity) {
  // 0.3% dodge chance per DEX point, capped at 20%
  return Math.min(0.20, dexterity * 0.003);
}

function calculateMagicResistance(wisdom) {
  // 1% magic resistance per WIS point, capped at 50%
  return Math.min(0.50, wisdom * 0.01);
}

function calculatePhysicalResistance(constitution) {
  // 0.75% physical resistance per CON point, capped at 40%
  return Math.min(0.40, constitution * 0.0075);
}

// Helper functions
function calculateDamage(attributeValue, minDamage, maxDamage) {
  // Calculate damage based on attribute and random factor
  const attributeBonus = Math.floor(attributeValue / 5);
  const baseDamage = Math.floor(
    Math.random() * (maxDamage - minDamage + 1) + minDamage
  );
  
  return baseDamage + attributeBonus;
}

function calculateExpForNextLevel(currentLevel) {
  // Simple exponential experience formula
  return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
}

class GameService {
  constructor() {
    this.spawnService = new SpawnService(this);
  }

  async initialize() {
    try {
      // Initialize the spawn service
      await this.spawnService.initialize();
      
      console.log('Game service initialized successfully.');
    } catch (error) {
      console.error('Error initializing game service:', error);
    }
  }

  /**
   * Get information about a zone, including monsters and items
   * @param {string} zoneId - The zone ID to get info for
   * @returns {object} - Zone information including monsters and items
   */
  async getZoneInfo(zoneId) {
    try {
      const zone = await Zone.findById(zoneId);
      if (!zone) return null;
      
      // Get monsters and items in this zone
      const monsters = this.spawnService.getZoneMonsters(zoneId);
      const items = this.spawnService.getZoneItems(zoneId);
      
      return {
        id: zone._id,
        name: zone.name,
        displayName: zone.displayName,
        description: zone.description,
        levelRange: zone.levelRange,
        terrainType: zone.terrainType,
        dangerLevel: zone.dangerLevel,
        isSafe: zone.isSafe,
        connections: zone.connections,
        npcs: zone.npcs,
        ambientText: zone.ambientText,
        monsters,
        items
      };
    } catch (error) {
      console.error('Error getting zone info:', error);
      return null;
    }
  }

  /**
   * Process player movement to a new zone
   * @param {string} playerId - Player ID
   * @param {string} targetZoneId - Target zone ID
   * @returns {object} - New zone info or error
   */
  async movePlayerToZone(playerId, targetZoneId) {
    try {
      const player = await Player.findById(playerId);
      if (!player) return { success: false, message: 'Player not found' };
      
      // Check if player can move to the target zone (from current zone)
      const currentZone = await Zone.findById(player.location.zoneId);
      if (!currentZone) return { success: false, message: 'Current zone not found' };
      
      // Check if the target zone is connected to the current zone
      const isConnected = currentZone.connections.some(conn => conn.zoneId.toString() === targetZoneId);
      if (!isConnected) return { success: false, message: 'Cannot travel to that zone from here' };
      
      // Update player's location
      player.location.zoneId = targetZoneId;
      await player.save();
      
      // Get zone info for the new zone
      const zoneInfo = await this.getZoneInfo(targetZoneId);
      
      // Notify other players in the old zone that this player left
      this.notifyZoneUpdate(currentZone._id, {
        type: 'player_left',
        playerId: player._id,
        playerName: player.name
      });
      
      // Notify players in the new zone that this player arrived
      this.notifyZoneUpdate(targetZoneId, {
        type: 'player_arrived',
        playerId: player._id,
        playerName: player.name
      });
      
      return { 
        success: true, 
        message: `Moved to ${zoneInfo.displayName}`,
        zoneInfo
      };
    } catch (error) {
      console.error('Error moving player to zone:', error);
      return { success: false, message: 'Error moving to zone' };
    }
  }

  /**
   * Process player attacking a monster
   * @param {string} playerId - Player ID
   * @param {string} monsterInstanceId - Monster instance ID
   * @returns {object} - Combat result
   */
  async attackMonster(playerId, monsterInstanceId) {
    try {
      const player = await Player.findById(playerId);
      if (!player) return { success: false, message: 'Player not found' };
      
      // Get the monster instance
      const monster = this.spawnService.getMonsterByInstanceId(monsterInstanceId);
      if (!monster) return { success: false, message: 'Monster not found' };
      if (!monster.isAlive) return { success: false, message: 'That monster is already dead' };
      
      // Check if player is in same zone as monster
      if (player.location.zoneId.toString() !== monster.zoneId.toString()) {
        return { success: false, message: 'Monster is not in your zone' };
      }
      
      // Combat calculations (basic version - to be expanded)
      const playerDamage = this.calculatePlayerDamage(player, monster);
      
      // Update monster health
      const updatedHealth = Math.max(0, monster.stats.currentHealth - playerDamage.amount);
      const monsterDead = updatedHealth === 0;
      
      // Apply damage to monster
      this.spawnService.updateMonster(monsterInstanceId, {
        stats: { currentHealth: updatedHealth },
        lastCombatTime: Date.now(),
        target: playerId
      });
      
      let result = {
        success: true,
        playerDamage: playerDamage.amount,
        monsterHealth: updatedHealth,
        monsterMaxHealth: monster.stats.maxHealth,
        isCritical: playerDamage.isCritical
      };
      
      // If monster still alive, it counter-attacks
      if (!monsterDead) {
        const monsterDamage = this.calculateMonsterDamage(monster, player);
        
        // Apply damage to player
        player.stats.currentHealth = Math.max(0, player.stats.currentHealth - monsterDamage.amount);
        await player.save();
        
        result.monsterDamage = monsterDamage.amount;
        result.playerHealth = player.stats.currentHealth;
        result.playerMaxHealth = player.stats.maxHealth;
        
        // Check if player died
        if (player.stats.currentHealth === 0) {
          await this.handlePlayerDeath(player);
          result.playerDied = true;
        }
      } else {
        // Monster died
        const loot = await this.spawnService.handleMonsterDeath(monster, playerId);
        
        // Award XP and update player
        const experienceGained = monster.experienceValue;
        player.experience += experienceGained;
        
        // Check for level up
        if (this.checkLevelUp(player)) {
          result.levelUp = true;
          result.newLevel = player.level;
        }
        
        await player.save();
        
        result.monsterDied = true;
        result.experienceGained = experienceGained;
        result.loot = loot;
      }
      
      // Notify all players in the zone about the combat
      this.notifyZoneUpdate(player.location.zoneId, {
        type: 'combat_update',
        playerId: player._id,
        playerName: player.name,
        monsterInstanceId: monster.instanceId,
        monsterName: monster.name,
        playerDamage: result.playerDamage,
        monsterDead: result.monsterDied || false
      });
      
      return result;
    } catch (error) {
      console.error('Error in attack monster:', error);
      return { success: false, message: 'Error processing attack' };
    }
  }

  /**
   * Process player collecting an item
   * @param {string} playerId - Player ID
   * @param {string} itemInstanceId - Item instance ID
   * @returns {object} - Result of item collection
   */
  async collectItem(playerId, itemInstanceId) {
    try {
      const player = await Player.findById(playerId);
      if (!player) return { success: false, message: 'Player not found' };
      
      // Get the item instance
      const item = this.spawnService.getItemByInstanceId(itemInstanceId);
      if (!item) return { success: false, message: 'Item not found' };
      
      // Check if player is in same zone as item
      if (player.location.zoneId.toString() !== item.zoneId.toString()) {
        return { success: false, message: 'Item is not in your zone' };
      }
      
      // Handle currency items differently
      if (item.type === 'currency') {
        player.currency += item.quantity;
        await player.save();
        
        // Remove the item from the zone
        this.spawnService.collectItem(itemInstanceId);
        
        return { 
          success: true, 
          message: `Collected ${item.quantity} ${item.name}`,
          currencyGained: item.quantity,
          newCurrencyTotal: player.currency
        };
      }
      
      // For regular items, check if player has space in inventory
      if (player.inventory.length >= player.inventorySize) {
        return { success: false, message: 'Your inventory is full' };
      }
      
      // Check if item is stackable and player already has one
      let stacked = false;
      
      if (item.stackable) {
        // Find existing stack in inventory
        const existingItemIndex = player.inventory.findIndex(invItem => 
          invItem.itemId === item.id && invItem.quantity < invItem.maxStack
        );
        
        if (existingItemIndex >= 0) {
          // Add to existing stack
          const existingItem = player.inventory[existingItemIndex];
          const newQuantity = Math.min(existingItem.quantity + item.quantity, existingItem.maxStack);
          const quantityAdded = newQuantity - existingItem.quantity;
          
          player.inventory[existingItemIndex].quantity = newQuantity;
          stacked = true;
          
          // If we couldn't add all of the quantity, adjust the item we're collecting
          if (quantityAdded < item.quantity) {
            item.quantity -= quantityAdded;
          } else {
            // Remove the item from the zone
            this.spawnService.collectItem(itemInstanceId);
          }
        }
      }
      
      // If not stacked (or only partially stacked), add as new item
      if (!stacked) {
        // Create inventory entry for this item
        player.inventory.push({
          itemId: item.id,
          name: item.name,
          type: item.type,
          subType: item.subType,
          rarity: item.rarity,
          level: item.level,
          quantity: item.quantity,
          equippable: item.equippable || false,
          equipSlot: item.equipSlot,
          stackable: item.stackable || false,
          maxStack: item.maxStack || 1
        });
        
        // Remove the item from the zone
        this.spawnService.collectItem(itemInstanceId);
      }
      
      // Save player
      await player.save();
      
      // Notify all players in the zone
      this.notifyZoneUpdate(player.location.zoneId, {
        type: 'item_collected',
        playerId: player._id,
        playerName: player.name,
        itemName: item.name,
        itemRarity: item.rarity
      });
      
      return { 
        success: true, 
        message: `Collected ${item.name}`,
        item: {
          name: item.name,
          type: item.type,
          rarity: item.rarity,
          quantity: item.quantity
        }
      };
    } catch (error) {
      console.error('Error collecting item:', error);
      return { success: false, message: 'Error collecting item' };
    }
  }

  /**
   * Calculate damage dealt by a player
   * @param {object} player - Player object
   * @param {object} monster - Target monster object
   * @returns {object} - Damage object with properties: amount, isCritical
   */
  calculatePlayerDamage(player, monster) {
    // Get player stats
    const attributes = player.attributes || player.character.attributes;
    const strength = attributes.strength || 10;
    const dexterity = attributes.dexterity || 10;
    const intelligence = attributes.intelligence || 10;
    
    // Calculate base damage
    let baseDamage = 5; // Default unarmed damage
    
    // Add weapon damage if equipped
    if (player.equipment && player.equipment.mainHand) {
      const weapon = player.equipment.mainHand;
      // Get weapon damage range or default to 1-5
      const minDmg = weapon.damage?.min || 1;
      const maxDmg = weapon.damage?.max || 5;
      baseDamage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
    }
    
    // Apply strength modifier (5% damage per point)
    const strMod = 1 + (strength * 0.05);
    let damage = baseDamage * strMod;
    
    // Check for critical hit (based on dexterity)
    const critChance = calculateCritChance(dexterity);
    const isCritical = Math.random() < critChance;
    
    if (isCritical) {
      damage *= 1.5; // 50% more damage on crit
    }
    
    // Apply monster's physical resistance (based on constitution)
    const monsterResistance = calculatePhysicalResistance(monster.attributes?.constitution || 5);
    damage *= (1 - monsterResistance);
    
    // Apply random variation (±15%)
    const variation = 0.15;
    damage *= (1 - variation) + (Math.random() * variation * 2);
    
    // Ensure minimum damage is 1
    damage = Math.max(1, Math.floor(damage));
    
    return {
      amount: damage,
      isCritical: isCritical
    };
  }

  /**
   * Calculate damage dealt by a monster
   * @param {object} monster - Monster object
   * @param {object} player - Target player object
   * @returns {object} - Damage object with properties: amount, isCritical
   */
  calculateMonsterDamage(monster, player) {
    // Get monster stats
    const strength = monster.attributes?.strength || 5;
    const dexterity = monster.attributes?.dexterity || 5;
    
    // Base damage calculation
    let baseDamage = strength;
    
    // Apply level scaling
    baseDamage += (monster.level - 1);
    
    // Check for critical hit
    const critChance = calculateCritChance(dexterity);
    const isCritical = Math.random() < critChance;
    
    if (isCritical) {
      baseDamage *= 1.5; // 50% more damage on crit
    }
    
    // Apply player's physical resistance (based on constitution)
    const playerResistance = calculatePhysicalResistance(player.attributes?.constitution || 
                                                        player.character?.attributes?.constitution || 10);
    baseDamage *= (1 - playerResistance);
    
    // Apply randomness with 20% variation
    const damageVariation = 0.2;
    baseDamage *= (1 - damageVariation) + (Math.random() * damageVariation * 2);
    
    // Ensure minimum damage of 1
    const finalDamage = Math.max(1, Math.floor(baseDamage));
    
    return {
      amount: finalDamage,
      isCritical: isCritical
    };
  }

  /**
   * Handle player death
   * @param {object} player - Player object
   */
  async handlePlayerDeath(player) {
    try {
      // Find the starting zone (safe zone)
      const startingZone = await Zone.findOne({ name: 'starting-village' });
      if (!startingZone) return;
      
      // Move player to starting zone
      player.location.zoneId = startingZone._id;
      
      // Restore some health
      player.stats.currentHealth = Math.floor(player.stats.maxHealth * 0.5);
      
      // Save player
      await player.save();
      
      // Notify players in the new zone
      this.notifyZoneUpdate(startingZone._id, {
        type: 'player_arrived',
        playerId: player._id,
        playerName: player.name,
        message: `${player.name} has been defeated and returned to the village.`
      });
      
    } catch (error) {
      console.error('Error handling player death:', error);
    }
  }

  /**
   * Check if a player should level up
   * @param {object} player - Player object
   * @returns {boolean} - Whether player leveled up
   */
  checkLevelUp(player) {
    // Calculate XP needed for next level: level * 100
    const xpForNextLevel = player.level * 100;
    
    if (player.experience >= xpForNextLevel) {
      // Level up
      player.level += 1;
      
      // Calculate stat increases
      player.attributes.strength += 1;
      player.attributes.dexterity += 1;
      player.attributes.constitution += 1;
      player.attributes.intelligence += 1;
      
      // Update max health and mana
      player.stats.maxHealth += 10;
      player.stats.maxMana += 5;
      
      // Restore health and mana on level up
      player.stats.currentHealth = player.stats.maxHealth;
      player.stats.currentMana = player.stats.maxMana;
      
      return true;
    }
    
    return false;
  }
}

// Export GameService and playerActions
module.exports = {
  GameService,
  playerActions
}; 
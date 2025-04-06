const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import models
const Player = require('./models/Player');
const Monster = require('./models/Monster');
const Zone = require('./models/Zone');
const Map = require('./models/Map');

// Import routes
const authRoutes = require('./routes/auth');

// Import middleware
const auth = require('./middleware/auth');
// Import services
const gameService = require('./services/gameService');
const locationService = require('./services/locationService');
const lootService = require('./services/lootService');
const inventoryService = require('./services/inventoryService');
const mapService = require('./services/mapService');
const { playerActions } = gameService;

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fantasy-mmorpg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Fantasy MMORPG API is running');
});

// Player data for sockets
const activePlayers = new Map();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle player joining the game
  socket.on('player:join', async (data) => {
    try {
      // Authenticate player
      const playerId = data.playerId;
      
      if (!playerId) {
        socket.emit('error', { message: 'Player ID required' });
        return;
      }
      
      // Store player ID with socket
      socket.playerId = playerId;
      activePlayers.set(socket.id, { playerId, socketId: socket.id });
      
      // Join player-specific room for targeted events
      socket.join(`player:${playerId}`);
      
      console.log(`Player ${playerId} joined with socket ${socket.id}`);
      
      socket.emit('player:joined', { 
        success: true, 
        message: 'Successfully joined the game'
      });
    } catch (error) {
      console.error('Player join error:', error);
      socket.emit('error', { message: 'Error joining the game' });
    }
  });
  
  // Helper function to handle player actions
  const handlePlayerAction = async (playerId, action) => {
    try {
      switch (action.type) {
        case 'getMapView':
          // Get the player's current map view
          const viewRadius = action.viewRadius || 10;
          const mapViewPlayer = await Player.findById(playerId);
            
          if (!mapViewPlayer) {
            return { success: false, message: 'Player not found' };
          }
            
          // Check if player is on a map
          if (!mapViewPlayer.character.currentMap) {
            return { success: false, message: 'Player is not on a map' };
          }
            
          // Get the map view from the map service
          return await mapService.getMapView(playerId, viewRadius);
          
        case 'enterMap':
          // Move player to a map
          const { mapName, x, y } = action;
          if (!mapName) {
            return { success: false, message: 'Map name is required' };
          }
            
          // Default coordinates if not provided
          const targetX = x || 0;
          const targetY = y || 0;
            
          // Move player to the map
          const moveResult = await mapService.movePlayerToMap(playerId, mapName, targetX, targetY);
            
          // If successful, also return the map view
          if (moveResult.success) {
            const mapView = await mapService.getMapView(playerId);
            moveResult.mapView = mapView;
          }
          return moveResult;
          
        case 'listMaps':
          // List all available maps
          const maps = await mapService.listMaps();
          return {
            success: true,
            maps: maps.map(map => ({
              name: map.name,
              displayName: map.displayName,
              regionType: map.regionType,
              levelRange: map.levelRange,
              isDangerous: map.properties?.isDangerous,
              isSafe: map.properties?.isSafe,
              isStartingMap: map.properties?.isStartingMap
            }))
          };
        
        case 'movePosition':
          // Move player on a map
          const movePosPlayer = await Player.findById(playerId);
          if (!movePosPlayer) {
            return { success: false, message: 'Player not found' };
          }
          
          // If on a map, use mapService
          if (movePosPlayer.character.currentMap) {
            return await mapService.movePlayerOnMap(playerId, action.x, action.y);
          } else {
            // Legacy position update for zones
            const prevX = movePosPlayer.character.position.x;
            const prevY = movePosPlayer.character.position.y;
            
            // Update position
            movePosPlayer.character.position.x = action.x;
            movePosPlayer.character.position.y = action.y;
            
            // Track steps
            if (action.x !== prevX || action.y !== prevY) {
              if (!movePosPlayer.character.stats) {
                movePosPlayer.character.stats = {};
              }
              movePosPlayer.character.stats.stepsWalked = (movePosPlayer.character.stats.stepsWalked || 0) + 1;
            }
            
            await movePosPlayer.save();
            return { success: true, position: { x: action.x, y: action.y } };
          }
          
        // Default actions proceed unchanged
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error handling action ${action.type}:`, error);
      return { success: false, message: `Error processing ${action.type}: ${error.message}` };
    }
  };
  
  // Handle player actions
  socket.on('player:action', async (action) => {
    try {
      const playerId = socket.playerId;
      
      if (!playerId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }
      
      // First try new action handler
      const mapResult = await handlePlayerAction(playerId, action);
      if (mapResult) {
        // Got a result from the map handler
        socket.emit('player:action:result', mapResult);
        return;
      }
      
      // Otherwise fall back to original handlers
      let result;
      
      // Process different player actions
      switch (action.type) {
        case 'getPlayerStats':
          // Get player stats
          try {
            const statsPlayer = await Player.findById(playerId);
            if (!statsPlayer) {
              result = { success: false, message: 'Player not found' };
              break;
            }
            
            result = { 
              success: true,
              type: 'getPlayerStats',
              message: 'Player stats retrieved',
              level: statsPlayer.character.level,
              experience: statsPlayer.character.experience,
              experienceToNextLevel: statsPlayer.character.experienceToNextLevel,
              health: statsPlayer.character.health,
              mana: statsPlayer.character.mana,
              attributes: statsPlayer.character.attributes,
              stats: statsPlayer.character.stats,
              resistances: statsPlayer.character.resistances || {
                physical: 0,
                fire: 0,
                ice: 0,
                lightning: 0,
                poison: 0,
                dark: 0,
                light: 0
              }
            };
          } catch (error) {
            console.error('Error getting player stats:', error);
            result = { success: false, message: 'Error retrieving player stats' };
          }
          break;
          
        case 'getInventory':
          // Get player inventory
          try {
            // Check if we have inventoryService imported
            if (typeof inventoryService !== 'undefined' && inventoryService.getPlayerInventory) {
              const inventoryResult = await inventoryService.getPlayerInventory(playerId);
              if (inventoryResult.success) {
                result = {
                  success: true,
                  type: 'getInventory',
                  message: 'Inventory retrieved',
                  inventory: inventoryResult.inventory,
                  equipment: inventoryResult.equipment,
                  gold: inventoryResult.gold
                };
              } else {
                result = inventoryResult;
              }
            } else {
              // Fallback to basic inventory retrieval
              const invPlayer = await Player.findById(playerId);
              if (!invPlayer) {
                result = { success: false, message: 'Player not found' };
                break;
              }
              
              result = {
                success: true,
                type: 'getInventory',
                message: 'Inventory retrieved',
                inventory: invPlayer.character.inventory || [],
                equipment: invPlayer.character.equipment || {},
                gold: invPlayer.character.gold || { carried: 0, bank: 0 }
              };
            }
          } catch (error) {
            console.error('Error getting inventory:', error);
            result = { success: false, message: 'Error retrieving inventory' };
          }
          break;
          
        case 'getZoneInfo':
          // Get the player's current zone
          const player = await Player.findById(playerId);
          if (!player) {
            socket.emit('error', { message: 'Player not found' });
            return;
          }
          
          // Find the zone
          let zoneName = player.character.currentZone;
          let zone = await Zone.findOne({ name: zoneName });
          
          if (!zone) {
            console.log(`Zone "${zoneName}" not found. Creating a default zone.`);
            
            // Create a default starting zone if not found
            zone = new Zone({
              name: 'starting-area',
              displayName: 'Starting Area',
              description: 'A peaceful clearing in the forest. This is where your adventure begins.',
              levelRange: { min: 1, max: 5 },
              terrain: 'forest',
              isDangerous: false,
              isSafe: true,
              isStartingZone: true,
              connections: [] // Remove default connections that lead to non-existent zones
            });
            
            try {
              await zone.save();
              console.log(`Created default zone: ${zone.name}`);
              
              // If player's zone was different, update it to this one
              if (player.character.currentZone !== 'starting-area') {
                player.character.currentZone = 'starting-area';
                await player.save();
                console.log(`Updated player zone to starting-area`);
              }
            } catch (error) {
              console.error('Error creating default zone:', error);
              socket.emit('error', { message: 'Error creating default zone' });
              return;
            }
          }
          
          console.log(`Sending zone info for ${zone.name} to player ${playerId}`);
          
          // Get any entities in this zone (like monsters, NPCs)
          const zoneEntities = [];
          
          // Add sample monsters since we don't have real ones yet
          zoneEntities.push({
            id: 'wolf-1',
            name: 'Forest Wolf',
            type: 'monster',
            level: 2,
            description: 'A hungry wolf prowling for prey',
            health: 50,
            maxHealth: 50
          });
          
          zoneEntities.push({
            id: 'goblin-1',
            name: 'Goblin Scout',
            type: 'monster',
            level: 3,
            description: 'A small goblin with a crude dagger',
            health: 40,
            maxHealth: 40
          });
          
          zoneEntities.push({
            id: 'spider-1',
            name: 'Giant Spider',
            type: 'monster',
            level: 2,
            description: 'A hairy spider the size of a dog',
            health: 30,
            maxHealth: 30
          });
          
          // Check if there are any monsters in the database for this zone
          try {
            const monsters = await Monster.find({ 
              spawnZones: zoneName,
              isActive: true
            }).limit(5);
            
            // Add database monsters if they exist
            monsters.forEach(monster => {
              zoneEntities.push({
                id: monster._id,
                name: monster.name,
                type: 'monster',
                description: monster.description
              });
            });
          } catch (error) {
            console.error('Error loading monsters:', error);
          }
          
          // Ensure connections array exists and is valid
          const connections = zone.connections || [];
          
          // Check if player is on a map
          if (player.character.currentMap) {
            result = { 
              success: false, 
              message: 'Player is on a map, not a zone. Use getMapView instead.',
              isOnMap: true,
              mapName: player.character.currentMap
            };
          } else {
            // Add map connections
            try {
              const availableMaps = await Map.find({}, 'name displayName regionType');
              const mapConnections = availableMaps.map(map => ({
                zoneName: null,
                mapName: map.name,
                description: `Enter ${map.displayName}`,
                direction: 'portal'
              }));
              
              result = {
                success: true,
                message: `You are in ${zone.displayName}`,
                zone: {
                  name: zone.name,
                  displayName: zone.displayName,
                  description: zone.description,
                  connections: connections,
                  mapConnections: mapConnections,
                  entities: zoneEntities
                }
              };
            } catch (error) {
              console.error('Error adding map connections:', error);
              
              // Fall back to just zone info
              result = {
                success: true,
                message: `You are in ${zone.displayName}`,
                zone: {
                  name: zone.name,
                  displayName: zone.displayName,
                  description: zone.description,
                  connections: connections,
                  entities: zoneEntities
                }
              };
            }
          }
          break;
          
        case 'move':
          result = await playerActions.movePlayer(playerId, action.destination);
          break;
          
        case 'attack':
          result = await handleAttack(playerId, action.monsterId);
          break;
          
        default:
          result = { success: false, message: 'Unknown action type' };
      }
      
      // Send result back to player
      socket.emit('player:action:result', result);
    } catch (error) {
      console.error('Player action error:', error);
      socket.emit('error', { message: 'Error processing action' });
    }
  });
  
  // Handle chat messages
  socket.on('chat:message', (message) => {
    // Check if message has required fields
    if (!message.content || !socket.playerId) {
      return;
    }
    
    // Determine chat scope
    switch (message.scope) {
      case 'global':
        // Broadcast to all players
        io.emit('chat:message', {
          playerId: socket.playerId,
          playerName: message.playerName,
          content: message.content,
          scope: 'global',
          timestamp: Date.now()
        });
        break;
        
      case 'zone':
        // Broadcast to players in the same zone
        if (message.zone) {
          socket.to(`zone:${message.zone}`).emit('chat:message', {
            playerId: socket.playerId,
            playerName: message.playerName,
            content: message.content,
            scope: 'zone',
            timestamp: Date.now()
          });
        }
        break;
        
      case 'private':
        // Send to specific player
        if (message.targetId) {
          io.to(`player:${message.targetId}`).emit('chat:message', {
            playerId: socket.playerId,
            playerName: message.playerName,
            content: message.content,
            scope: 'private',
            timestamp: Date.now()
          });
        }
        break;
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from active players with error handling
    try {
      if (activePlayers && typeof activePlayers.has === 'function' && activePlayers.has(socket.id)) {
        const playerData = activePlayers.get(socket.id);
        if (playerData && playerData.playerId) {
          console.log(`Player ${playerData.playerId} disconnected`);
        }
        activePlayers.delete(socket.id);
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// Create temporary combat handler for our monster IDs
// Store monster states to preserve health between attacks
const monsterStates = {};

const handleAttack = async (playerId, monsterId) => {
  try {
    const player = await Player.findById(playerId);
    if (!player) {
      return { 
        success: false, 
        message: 'Player not found' 
      };
    }
    
    // Determine which monster is being attacked
    let monsterName, monsterHealth, monsterMaxHealth, monsterAttributes;
    
    switch(monsterId) {
      case 'wolf-1':
        monsterName = 'Forest Wolf';
        monsterMaxHealth = 50;
        monsterAttributes = {
          strength: 8,
          dexterity: 12,
          intelligence: 3,
          constitution: 7,
          wisdom: 5,
          vitality: 10
        };
        break;
      case 'goblin-1':
        monsterName = 'Goblin Scout';
        monsterMaxHealth = 40;
        monsterAttributes = {
          strength: 7,
          dexterity: 14,
          intelligence: 6,
          constitution: 6,
          wisdom: 5,
          vitality: 8
        };
        break;
      case 'spider-1':
        monsterName = 'Giant Spider';
        monsterMaxHealth = 30;
        monsterAttributes = {
          strength: 5,
          dexterity: 16,
          intelligence: 2,
          constitution: 5,
          wisdom: 8,
          vitality: 6
        };
        break;
      default:
        return { 
          success: false, 
          message: 'Monster not found' 
        };
    }
    
    // Get or initialize monster state
    if (!monsterStates[monsterId]) {
      monsterStates[monsterId] = {
        health: monsterMaxHealth,
        lastCombatTime: Date.now()
      };
    }
    
    // Get current monster health from state
    monsterHealth = monsterStates[monsterId].health;
    
    // Check if monster should have regenerated (if last combat was > 30 seconds ago)
    const timeSinceCombat = Date.now() - monsterStates[monsterId].lastCombatTime;
    if (timeSinceCombat > 30000) { // 30 seconds
      monsterHealth = monsterMaxHealth;
      monsterStates[monsterId].health = monsterHealth;
    }
    
    // Update last combat time
    monsterStates[monsterId].lastCombatTime = Date.now();
    
    // Get player attributes
    const playerAttr = player.character.attributes;
    
    // Calculate player damage
    // Base damage (5-15)
    const baseDamage = Math.floor(Math.random() * 11) + 5;
    
    // Strength bonus (5% per point)
    const strBonus = 1 + (playerAttr.strength * 0.05);
    let playerDamage = Math.floor(baseDamage * strBonus);
    
    // Check for critical hit (based on DEX)
    const critChance = Math.min(0.25, playerAttr.dexterity * 0.005);
    const isCritical = Math.random() < critChance;
    
    if (isCritical) {
      playerDamage = Math.floor(playerDamage * 1.5);
    }
    
    // Apply monster's physical resistance (based on CON)
    const monsterResistance = Math.min(0.40, monsterAttributes.constitution * 0.0075);
    playerDamage = Math.floor(playerDamage * (1 - monsterResistance));
    
    // Ensure minimum damage of 1
    playerDamage = Math.max(1, playerDamage);
    
    // Calculate monster health after attack
    monsterHealth = Math.max(0, monsterHealth - playerDamage);
    
    // Update monster state
    monsterStates[monsterId].health = monsterHealth;
    
    const monsterDefeated = monsterHealth <= 0;
    
    // Prepare result
    const result = {
      success: true,
      playerDamage,
      monsterHealth,
      monsterMaxHealth,
      isCritical,
      message: `You hit the ${monsterName} for ${playerDamage} damage!`
    };
    
    if (isCritical) {
      result.message += " CRITICAL HIT!";
    }
    
    if (monsterDefeated) {
      // Monster was defeated
      result.monsterDied = true;
      result.message += ` You have defeated the ${monsterName}!`;
      
      // Reset monster health for next encounter
      monsterStates[monsterId].health = monsterMaxHealth;
      
      // Add rewards
      const experienceGained = 20;
      result.experienceGained = experienceGained;
      
      // Generate loot from monster
      const loot = await lootService.generateMonsterLoot(monsterId);
      
      // Add gold based on monster level
      const goldGained = lootService.generateGoldLoot(5, 15);
      result.goldGained = goldGained;
      
      // Add loot and gold to player
      const lootResult = await lootService.addLootToPlayer(playerId, loot, goldGained);
      result.loot = lootResult.addedItems;
      
      // Use player's own experience method
      const expResult = player.addExperience(experienceGained);
      result.levelUp = expResult.leveledUp;
      result.newLevel = expResult.leveledUp ? expResult.newLevel : null;
      
      // Track monster kill in player stats
      player.addMonsterKill(monsterId, monsterName);
      
      // Update player stats
      if (!player.character.stats) {
        player.character.stats = {};
      }
      player.character.stats.totalDamageDealt = (player.character.stats.totalDamageDealt || 0) + playerDamage;
      
      await player.save();
    } else {
      // Monster counter-attacks
      // Base damage (3-8)
      let monsterBaseDamage = Math.floor(Math.random() * 6) + 3;
      
      // Apply STR bonus
      monsterBaseDamage = Math.floor(monsterBaseDamage * (1 + (monsterAttributes.strength * 0.05)));
      
      // Check for critical hit
      const monsterCritChance = Math.min(0.25, monsterAttributes.dexterity * 0.005);
      const monsterCritical = Math.random() < monsterCritChance;
      
      if (monsterCritical) {
        monsterBaseDamage = Math.floor(monsterBaseDamage * 1.5);
      }
      
      // Apply player's physical resistance
      const playerResistance = Math.min(0.40, playerAttr.constitution * 0.0075);
      const monsterDamage = Math.max(1, Math.floor(monsterBaseDamage * (1 - playerResistance)));
      
      // Apply damage to player
      player.character.health.current = Math.max(0, player.character.health.current - monsterDamage);
      
      // Track damage taken in player stats
      if (!player.character.stats) {
        player.character.stats = {};
      }
      player.character.stats.totalDamageTaken = (player.character.stats.totalDamageTaken || 0) + monsterDamage;
      player.character.stats.totalDamageDealt = (player.character.stats.totalDamageDealt || 0) + playerDamage;
      
      result.monsterDamage = monsterDamage;
      result.monsterCritical = monsterCritical;
      result.playerHealth = player.character.health.current;
      result.playerMaxHealth = player.character.health.max;
      result.message += ` The ${monsterName} hits you for ${monsterDamage} damage!`;
      
      if (monsterCritical) {
        result.message += " CRITICAL HIT!";
      }
      
      // Check if player died
      if (player.character.health.current <= 0) {
        result.playerDied = true;
        result.message += ' You have been defeated!';
        
        // Track death in player stats
        player.character.stats.totalDeaths = (player.character.stats.totalDeaths || 0) + 1;
        
        // Revive player with half health
        player.character.health.current = Math.floor(player.character.health.max * 0.5);
      }
      
      await player.save();
    }
    
    return result;
  } catch (error) {
    console.error('Attack handler error:', error);
    return { success: false, message: 'Error processing combat' };
  }
};

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
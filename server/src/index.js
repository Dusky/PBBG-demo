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

// Import routes
const authRoutes = require('./routes/auth');

// Import middleware
const auth = require('./middleware/auth');
// Import game service and player actions
const gameService = require('./services/gameService');
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
  
  // Handle player actions
  socket.on('player:action', async (action) => {
    try {
      const playerId = socket.playerId;
      
      if (!playerId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }
      
      let result;
      
      // Process different player actions
      switch (action.type) {
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
            description: 'A hungry wolf prowling for prey'
          });
          
          zoneEntities.push({
            id: 'goblin-1',
            name: 'Goblin Scout',
            type: 'monster',
            description: 'A small goblin with a crude dagger'
          });
          
          zoneEntities.push({
            id: 'spider-1',
            name: 'Giant Spider',
            type: 'monster',
            description: 'A hairy spider the size of a dog'
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
    
    // Remove from active players
    if (activePlayers.has(socket.id)) {
      const { playerId } = activePlayers.get(socket.id);
      console.log(`Player ${playerId} disconnected`);
      activePlayers.delete(socket.id);
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
      result.loot = [{name: 'Wolf Pelt', quantity: 1}];
      
      // Update player
      player.character.experience += experienceGained;
      
      // Check if player leveled up (simplified)
      if (player.character.experience >= 100) {
        player.character.level += 1;
        player.character.experience = 0;
        result.levelUp = true;
        result.newLevel = player.character.level;
      }
      
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
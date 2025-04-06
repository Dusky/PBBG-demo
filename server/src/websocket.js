/**
 * WebSocket Handler for Fantasy Text MMORPG
 */
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Player = require('./models/Player');

class WebSocketHandler {
  constructor(server, gameService) {
    this.io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    this.gameService = gameService;
    this.playerSockets = new Map(); // Map of player ID to socket
    this.playerZones = new Map(); // Map of player ID to current zone ID
    
    this.setupSocketHandlers();
    
    console.log('WebSocket handler initialized');
  }
  
  /**
   * Set up WebSocket event handlers
   */
  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('New client connected');
      
      // Handle authentication
      socket.on('authenticate', async (data) => {
        try {
          // Verify JWT token
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          const playerId = decoded.id;
          
          // Find player
          const player = await Player.findById(playerId);
          if (!player) {
            socket.emit('error', { message: 'Authentication failed' });
            return;
          }
          
          // Store socket for this player
          this.playerSockets.set(playerId, socket);
          
          // Store player's current zone
          this.playerZones.set(playerId, player.location.zoneId.toString());
          
          // Join room for player's current zone
          socket.join(`zone:${player.location.zoneId}`);
          
          console.log(`Player ${player.name} (${playerId}) authenticated`);
          
          // Send player info
          socket.emit('authentication_success', {
            player: {
              id: player._id,
              name: player.name,
              level: player.level,
              experience: player.experience,
              currency: player.currency,
              stats: player.stats,
              attributes: player.attributes,
              inventory: player.inventory,
              equipment: player.equipment,
              location: player.location
            }
          });
          
          // Send zone info
          const zoneInfo = await this.gameService.getZoneInfo(player.location.zoneId);
          if (zoneInfo) {
            socket.emit('zone_info', zoneInfo);
          }
          
          // Handle player joining zone (notify other players)
          this.io.to(`zone:${player.location.zoneId}`).emit('player_joined', {
            player: {
              id: player._id,
              name: player.name,
              level: player.level
            }
          });
          
          // Set up disconnect handler
          socket.on('disconnect', () => {
            console.log(`Player ${player.name} (${playerId}) disconnected`);
            
            // Remove from maps
            this.playerSockets.delete(playerId);
            this.playerZones.delete(playerId);
            
            // Notify other players in zone
            this.io.to(`zone:${player.location.zoneId}`).emit('player_left', {
              playerId: player._id,
              playerName: player.name
            });
          });
          
          // Handle chat messages
          socket.on('chat_message', (data) => {
            // Get current zone ID
            const zoneId = this.playerZones.get(playerId);
            if (!zoneId) return;
            
            // Emit message to all players in the zone
            this.io.to(`zone:${zoneId}`).emit('chat_message', {
              playerId: player._id,
              playerName: player.name,
              message: data.message,
              timestamp: new Date()
            });
          });
          
          // Handle player movement
          socket.on('move_to_zone', async (data) => {
            const targetZoneId = data.zoneId;
            
            // Process movement
            const result = await this.gameService.movePlayerToZone(playerId, targetZoneId);
            
            // Send result to player
            socket.emit('move_result', result);
            
            if (result.success) {
              // Update player's zone in our map
              this.playerZones.set(playerId, targetZoneId);
              
              // Leave old zone room and join new one
              socket.leave(`zone:${player.location.zoneId}`);
              socket.join(`zone:${targetZoneId}`);
            }
          });
          
          // Handle combat
          socket.on('attack_monster', async (data) => {
            const monsterInstanceId = data.monsterInstanceId;
            
            // Process attack
            const result = await this.gameService.attackMonster(playerId, monsterInstanceId);
            
            // Send result to player
            socket.emit('attack_result', result);
          });
          
          // Handle item collection
          socket.on('collect_item', async (data) => {
            const itemInstanceId = data.itemInstanceId;
            
            // Process item collection
            const result = await this.gameService.collectItem(playerId, itemInstanceId);
            
            // Send result to player
            socket.emit('collect_result', result);
          });
          
          // Handle player stats request
          socket.on('get_player_stats', async () => {
            // Get fresh player data
            const freshPlayer = await Player.findById(playerId);
            if (!freshPlayer) return;
            
            socket.emit('player_stats', {
              level: freshPlayer.level,
              experience: freshPlayer.experience,
              currency: freshPlayer.currency,
              stats: freshPlayer.stats,
              attributes: freshPlayer.attributes
            });
          });
          
          // Handle inventory request
          socket.on('get_inventory', async () => {
            // Get fresh player data
            const freshPlayer = await Player.findById(playerId);
            if (!freshPlayer) return;
            
            socket.emit('inventory_data', {
              inventory: freshPlayer.inventory,
              equipment: freshPlayer.equipment,
              inventorySize: freshPlayer.inventorySize
            });
          });
          
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
        }
      });
    });
  }
  
  /**
   * Notify players in a zone about an update
   * @param {string} zoneId - Zone ID
   * @param {object} updateData - Update data to send
   */
  notifyZoneUpdate(zoneId, updateData) {
    this.io.to(`zone:${zoneId}`).emit('zone_update', updateData);
  }
  
  /**
   * Send a private message to a specific player
   * @param {string} playerId - Player ID
   * @param {string} event - Event name
   * @param {object} data - Data to send
   * @returns {boolean} - Whether message was sent
   */
  sendToPlayer(playerId, event, data) {
    const socket = this.playerSockets.get(playerId);
    if (socket) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }
  
  /**
   * Broadcast a message to all connected players
   * @param {string} event - Event name
   * @param {object} data - Data to send
   */
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = WebSocketHandler; 
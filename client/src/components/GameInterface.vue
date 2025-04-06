<template>
  <div class="game-interface">
    <div class="game-container">
      <div class="game-header">
        <h1>{{ gameTitle }}</h1>
      </div>
      
      <div class="game-content">
        <div class="game-panel left-panel">
          <div class="player-info">
            <div class="player-header">
              <h3>{{ player.character.name }}</h3>
              <div class="player-class">{{ player.character.class }} ({{ player.character.race }})</div>
            </div>
            
            <div class="progress-section">
              <div class="progress-row">
                <span class="progress-label">Level {{ player.character.level }}</span>
                <div class="progress-bar">
                  <div class="progress-fill xp-fill" 
                    :style="{ width: `${(player.character.experience / player.character.experienceToNextLevel) * 100}%` }">
                  </div>
                </div>
                <span class="progress-value">{{ player.character.experience }}/{{ player.character.experienceToNextLevel }}</span>
              </div>
              
              <div class="progress-row">
                <span class="progress-label">HP</span>
                <div class="progress-bar">
                  <div class="progress-fill hp-fill" 
                    :style="{ width: `${(player.character.health.current / player.character.health.max) * 100}%` }">
                  </div>
                </div>
                <span class="progress-value">{{ player.character.health.current }}/{{ player.character.health.max }}</span>
              </div>
              
              <div class="progress-row">
                <span class="progress-label">MP</span>
                <div class="progress-bar">
                  <div class="progress-fill mp-fill" 
                    :style="{ width: `${(player.character.mana.current / player.character.mana.max) * 100}%` }">
                  </div>
                </div>
                <span class="progress-value">{{ player.character.mana.current }}/{{ player.character.mana.max }}</span>
              </div>
            </div>
            
            <div class="stats-container">
              <div class="stats-section">
                <div class="stats-header">Attributes</div>
                <div class="player-attributes">
                  <div class="attr-row">
                    <span class="attr-label">STR:</span>
                    <span class="attr-value">{{ player.character.attributes.strength }}</span>
                    <span class="attr-label">DEX:</span>
                    <span class="attr-value">{{ player.character.attributes.dexterity }}</span>
                  </div>
                  <div class="attr-row">
                    <span class="attr-label">INT:</span>
                    <span class="attr-value">{{ player.character.attributes.intelligence }}</span>
                    <span class="attr-label">CON:</span>
                    <span class="attr-value">{{ player.character.attributes.constitution }}</span>
                  </div>
                  <div class="attr-row">
                    <span class="attr-label">WIS:</span>
                    <span class="attr-value">{{ player.character.attributes.wisdom || 10 }}</span>
                    <span class="attr-label">VIT:</span>
                    <span class="attr-value">{{ player.character.attributes.vitality || 10 }}</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-section">
                <div class="stats-header">Combat Stats</div>
                <div class="combat-stats">
                  <div class="stat-row">
                    <span class="stat-label">Damage:</span>
                    <span class="stat-value">{{ player.character.stats?.damageMin || 1 }}-{{ player.character.stats?.damageMax || 5 }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Crit:</span>
                    <span class="stat-value">{{ player.character.stats?.criticalChance || 5 }}%</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Defense:</span>
                    <span class="stat-value">{{ player.character.stats?.defense || 0 }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Evasion:</span>
                    <span class="stat-value">{{ player.character.stats?.evasion || 5 }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-section">
                <div class="stats-header">Resistances</div>
                <div class="resistances">
                  <div class="resist-row" v-for="(value, type) in player.character.resistances" :key="type">
                    <span class="resist-label">{{ capitalizeFirst(type) }}:</span>
                    <span class="resist-value">{{ value }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button @click="refreshPlayerStats" class="refresh-stats-btn">
              Refresh Stats
            </button>
          </div>
        </div>
        
        <div class="game-panel main-panel">
          <div class="main-content">
            <!-- Map and Navigation Section -->
            <div class="map-section">
              <h3>{{ currentZone ? currentZone.displayName : 'Loading Zone...' }}</h3>
              
              <!-- Player Position Display -->
              <div class="player-position">
                Position: X:{{ playerPosition.x - Math.floor(gridSize/2) }}, Y:{{ Math.floor(gridSize/2) - playerPosition.y }}
              </div>
              
              <!-- Visual Grid Map -->
              <div class="grid-map">
                <div v-for="(row, rowIndex) in gridMap" :key="`row-${rowIndex}`" class="map-row">
                  <div 
                    v-for="(cell, colIndex) in row" 
                    :key="`cell-${rowIndex}-${colIndex}`"
                    class="map-cell"
                    :class="{ 
                      'cell-wall': cell.type === 'wall',
                      'cell-path': cell.type === 'path',
                      'cell-player': cell.hasPlayer,
                      'cell-entity': cell.entities && cell.entities.length > 0 
                    }"
                    @click="interactWithCell(rowIndex, colIndex)"
                  >
                    <div v-if="cell.hasPlayer" class="player-marker">@</div>
                    <div v-else-if="cell.entities && cell.entities.length > 0" class="entity-marker">
                      {{ getEntityMarker(cell.entities[0]) }}
                    </div>
                    <div v-else>{{ getCellSymbol(cell) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Direction Buttons -->
              <div class="direction-controls">
                <div class="direction-row">
                  <button @click="moveToDirection('north')" class="direction-btn north-btn">
                    North
                  </button>
                </div>
                <div class="direction-row">
                  <button @click="moveToDirection('west')" class="direction-btn west-btn">
                    West
                  </button>
                  <div class="center-btn"></div>
                  <button @click="moveToDirection('east')" class="direction-btn east-btn">
                    East
                  </button>
                </div>
                <div class="direction-row">
                  <button @click="moveToDirection('south')" class="direction-btn south-btn">
                    South
                  </button>
                </div>
              </div>
              
              <!-- Zone Description -->
              <div class="zone-description" v-if="currentZone">
                <p>{{ currentZone.description }}</p>
              </div>
            </div>
            
            <!-- Combat/Monsters Section -->
            <div class="monsters-section">
              <!-- Zone Entities/Monsters List -->
              <div class="zone-entities" v-if="zoneEntities.length > 0">
                <h4>Monsters in this area:</h4>
                <div class="entity-list">
                  <div 
                    v-for="entity in zoneEntities" 
                    :key="entity.id"
                    class="entity-item"
                    :class="{ 'monster-entity': entity.type === 'monster' }"
                  >
                    <span class="entity-name">{{ entity.name }}</span>
                    <button 
                      v-if="entity.type === 'monster'" 
                      @click="interactWithEntity(entity)"
                      class="attack-btn"
                      :disabled="inCombat"
                    >
                      Attack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Game Output/Messages -->
          <div class="game-output">
            <div class="game-messages">
              <div v-for="(message, index) in gameMessages" :key="index" class="game-message" :class="message.type">
                {{ message.text }}
              </div>
            </div>
            <div v-if="inCombat" class="combat-status">
              <div class="combat-header-inline">
                <span class="combat-label">⚔️ Combat with {{ currentTarget.name }}</span>
                <button @click="stopCombat" class="stop-combat-btn-small">Retreat</button>
              </div>
              <div class="health-bars">
                <div>
                  {{ player.character.name }}: {{ player.character.health.current }}/{{ player.character.health.max }}
                  <div class="health-bar-small">
                    <div class="health-fill-small player-health" :style="{ width: `${(player.character.health.current / player.character.health.max) * 100}%` }"></div>
                  </div>
                </div>
                <div>
                  {{ currentTarget.name }}: {{ currentTarget.health.current }}/{{ currentTarget.health.max }}
                  <div class="health-bar-small">
                    <div class="health-fill-small monster-health" :style="{ width: `${(currentTarget.health.current / currentTarget.health.max) * 100}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="game-panel right-panel">
          <div class="chat-window chronicle-panel">
            <div class="chronicle-header">
              <h3>The Chronicle</h3>
              <div class="channel-tabs">
                <span 
                  v-for="channel in chatChannels" 
                  :key="channel.value" 
                  @click="selectedChatChannel = channel.value"
                  class="channel-tab"
                  :class="{ 'active': selectedChatChannel === channel.value }"
                >
                  {{ channel.label }}
                </span>
              </div>
            </div>
            <div class="chronicle-messages">
              <div 
                v-for="(message, index) in filteredChatMessages" 
                :key="index" 
                class="chronicle-entry"
                :class="message.scope"
              >
                <span class="message-timestamp" v-if="showTimestamps">{{ formatTimestamp(message.timestamp) }}</span>
                <span class="message-sender" :class="'sender-' + message.scope">{{ message.playerName }}:</span>
                <span class="message-content">{{ message.content }}</span>
              </div>
            </div>
            <div class="chronicle-input">
              <div class="input-controls">
                <select v-model="chatScope" class="channel-select">
                  <option value="global">Global</option>
                  <option value="zone">Zone</option>
                  <option value="private">Private</option>
                </select>
                <span class="input-target" v-if="chatScope === 'private'">
                  To: <input v-model="privateTarget" placeholder="Player name" class="target-input" />
                </span>
                <button @click="toggleTimestamps" class="timestamp-toggle" :class="{ 'active': showTimestamps }">
                  🕒
                </button>
              </div>
              <div class="input-field">
                <input 
                  v-model="chatInput" 
                  @keyup.enter="sendChatMessage"
                  placeholder="Type a message..."
                  class="chronicle-text-input"
                />
                <button @click="sendChatMessage" class="chronicle-send-button">Send</button>
              </div>
            </div>
          </div>
          
          <div class="inventory-panel">
            <h3>Inventory</h3>
            <div class="inventory-header">
              <span>Gold: {{ player.character.gold?.carried || 0 }}</span>
              <button @click="refreshInventory" class="refresh-btn" title="Refresh Inventory">↻</button>
            </div>
            <div class="inventory-list">
              <div v-if="!player.character.inventory || player.character.inventory.length === 0" class="empty-inventory">
                <div class="empty-message">Your inventory is empty</div>
                <button @click="refreshInventory" class="refresh-btn">Refresh</button>
              </div>
              <div 
                v-for="item in player.character.inventory" 
                :key="item.itemId"
                class="inventory-item"
                :class="getItemRarityClass(item)"
                @click="useItem(item)"
                @mouseenter="hoveredItem = item.itemId"
                @mouseleave="hoveredItem = null"
              >
                <div class="item-name">{{ getItemName(item) }} ({{ item.quantity }})</div>
                <div class="item-type">{{ getItemType(item) }}</div>
                <div v-if="hoveredItem === item.itemId" class="item-tooltip">
                  <div class="tooltip-header">{{ getItemName(item) }}</div>
                  <div class="tooltip-type">{{ capitalizeFirst(getItemType(item)) }}</div>
                  <div class="tooltip-description">{{ getItemDescription(item) }}</div>
                  
                  <div v-if="hasItemAttributes(item)" class="tooltip-attributes">
                    <div v-if="getItemDamage(item)">Damage: {{ getItemDamage(item) }}</div>
                    <div v-if="getItemDefense(item)">Defense: {{ getItemDefense(item) }}</div>
                    <!-- Other attributes would be shown here -->
                  </div>
                  
                  <div v-if="getRequiredLevel(item) > 1" class="tooltip-required">
                    Requires Level: {{ getRequiredLevel(item) }}
                  </div>
                  
                  <div class="tooltip-value">Value: {{ getItemValue(item) }} gold</div>
                  <div class="tooltip-instructions">Click to use or equip</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import io from 'socket.io-client';

export default {
  name: 'GameInterface',
  
  props: {
    player: {
      type: Object,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  
  setup(props) {
    const store = useStore();
    const socket = ref(null);
    const gameTitle = ref('Fantasy Text MMORPG');
    const gameMessages = ref([]);
    const chatMessages = ref([]);
    const userInput = ref('');
    const chatInput = ref('');
    const chatScope = ref('global');
    const currentZone = ref(null);
    const zoneEntities = ref([]);
    
    // Grid map state
    const gridSize = 9; // 9x9 grid with player in the center
    const playerPosition = reactive({ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) });
    const gridMap = ref([]);
    
    // Combat state
    const inCombat = ref(false);
    const currentTarget = ref(null);
    const combatLog = ref([]);
    const combatInterval = ref(null);
    const combatTurn = ref(1);
    
    // Initialize grid map
    const initGridMap = () => {
      const newGrid = [];
      for (let y = 0; y < gridSize; y++) {
        const row = [];
        for (let x = 0; x < gridSize; x++) {
          row.push({
            type: 'path', // Default is navigable
            hasPlayer: x === playerPosition.x && y === playerPosition.y,
            entities: []
          });
        }
        newGrid.push(row);
      }
      
      // Add some walls at the edges, but leave doors for actual exits
      for (let i = 0; i < gridSize; i++) {
        // Top and bottom walls
        newGrid[0][i].type = 'wall';
        newGrid[gridSize-1][i].type = 'wall';
        
        // Left and right walls
        newGrid[i][0].type = 'wall';
        newGrid[i][gridSize-1].type = 'wall';
      }
      
      gridMap.value = newGrid;
    };
    
    // Generate grid map based on zone
    const generateGridFromZone = () => {
      if (!currentZone.value) return;
      
      initGridMap();
      
      // Place player at center
      const centerX = Math.floor(gridSize/2);
      const centerY = Math.floor(gridSize/2);
      playerPosition.x = centerX;
      playerPosition.y = centerY;
      
      // Add exits based on zone connections
      if (currentZone.value.connections) {
        currentZone.value.connections.forEach(conn => {
          switch(conn.direction.toLowerCase()) {
            case 'north':
              gridMap.value[0][centerX].type = 'door';
              break;
            case 'south':
              gridMap.value[gridSize-1][centerX].type = 'door';
              break;
            case 'east':
              gridMap.value[centerY][gridSize-1].type = 'door';
              break;
            case 'west':
              gridMap.value[centerY][0].type = 'door';
              break;
          }
        });
      }
      
      // We don't add entities to the grid anymore - they're displayed in a separate list
      
      // Update player position
      updatePlayerPosition();
    };
    
    // Get random positions around the player for entities
    const getRandomPositionsAroundPlayer = (count) => {
      const positions = [];
      const centerX = Math.floor(gridSize/2);
      const centerY = Math.floor(gridSize/2);
      
      // Define a radius around the player
      const radius = Math.min(3, Math.floor(gridSize/3));
      
      while (positions.length < count) {
        // Get random position within radius
        const x = centerX + Math.floor(Math.random() * (radius*2+1)) - radius;
        const y = centerY + Math.floor(Math.random() * (radius*2+1)) - radius;
        
        // Check if position is valid and not occupied
        if (x >= 1 && x < gridSize-1 && y >= 1 && y < gridSize-1 && // Not on edge
            !(x === centerX && y === centerY) && // Not on player
            !positions.some(pos => pos.x === x && pos.y === y)) { // Not already used
          positions.push({ x, y });
        }
      }
      
      return positions;
    };
    
    // Update player position on the grid
    const updatePlayerPosition = () => {
      // Clear player from all cells
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          gridMap.value[y][x].hasPlayer = false;
        }
      }
      
      // Set player in new position
      if (gridMap.value[playerPosition.y] && gridMap.value[playerPosition.y][playerPosition.x]) {
        gridMap.value[playerPosition.y][playerPosition.x].hasPlayer = true;
      }
    };
    
    // Get the symbol for a grid cell
    const getCellSymbol = (cell) => {
      if (cell.type === 'wall') return '#';
      if (cell.type === 'door') return 'D';
      return ' ';
    };
    
    // Get marker for entity
    const getEntityMarker = (entity) => {
      if (!entity) return '';
      
      switch(entity.type) {
        case 'monster': return 'M';
        case 'npc': return 'N';
        case 'resource': return 'R';
        case 'item': return 'I';
        default: return '?';
      }
    };
    
    // Interact with a cell on the grid
    const interactWithCell = (row, col) => {
      const cell = gridMap.value[row][col];
      
      // If cell is adjacent to player, move there
      if (isAdjacentToPlayer(row, col) && cell.type !== 'wall') {
        // Determine direction
        let direction = '';
        if (row < playerPosition.y) direction = 'north';
        else if (row > playerPosition.y) direction = 'south';
        else if (col < playerPosition.x) direction = 'west';
        else if (col > playerPosition.x) direction = 'east';
        
        if (direction) moveToDirection(direction);
      }
    };
    
    // Check if cell is adjacent to player
    const isAdjacentToPlayer = (row, col) => {
      return (
        (Math.abs(row - playerPosition.y) === 1 && col === playerPosition.x) ||
        (Math.abs(col - playerPosition.x) === 1 && row === playerPosition.y)
      );
    };
    
    // Get zone information from server
    const getZoneInfo = () => {
      if (!socket.value) {
        addGameMessage("Can't get zone info - not connected to server", 'error');
        console.error("Failed to get zone info: No socket connection");
        return;
      }
      
      // Check connection status
      if (!socket.value.connected) {
        addGameMessage("Can't get zone info - socket disconnected", 'error');
        console.error("Failed to get zone info: Socket disconnected");
        return;
      }
      
      addGameMessage("Requesting zone information...", 'system');
      console.log("Sending getZoneInfo request to server");
      
      // Request zone info from server
      socket.value.emit('player:action', {
        type: 'getZoneInfo'
      });
      
      // Add a timeout to detect if server doesn't respond
      setTimeout(() => {
        if (!currentZone.value) {
          console.warn("Zone info request timed out after 5 seconds");
          addGameMessage("Zone information request taking longer than expected...", 'warning');
        }
      }, 5000);
    };
    
    // Connect to socket.io server
    const connectToServer = () => {
      const serverUrl = process.env.VUE_APP_SERVER_URL || 'http://localhost:3000';
      socket.value = io(serverUrl);
      
      // Socket event listeners
      socket.value.on('connect', () => {
        addGameMessage('Connected to server', 'system');
        
        // Join game with player ID
        socket.value.emit('player:join', { 
          playerId: props.player.id,
          token: props.token
        });
      });
      
      socket.value.on('player:joined', (data) => {
        if (data.success) {
          addGameMessage('Successfully joined the game', 'system');
          // Request current zone information
          getZoneInfo();
        } else {
          addGameMessage(`Failed to join: ${data.message}`, 'error');
        }
      });
      
      socket.value.on('player:action:result', (result) => {
        if (result.success) {
          addGameMessage(result.message, 'success');
          
          // Handle combat results
          if (inCombat.value && (result.playerDamage || result.monsterDamage)) {
            // Update target health
            if (currentTarget.value && result.monsterHealth !== undefined) {
              currentTarget.value.health.current = result.monsterHealth;
              currentTarget.value.health.max = result.monsterMaxHealth || currentTarget.value.health.max;
            }
            
            // Update player health
            if (result.playerHealth !== undefined) {
              const updatedPlayer = { ...props.player };
              updatedPlayer.character.health.current = result.playerHealth;
              updatedPlayer.character.health.max = result.playerMaxHealth || props.player.character.health.max;
              store.commit('setPlayer', updatedPlayer);
            }
            
            // Add combat messages
            if (result.playerDamage) {
              const critText = result.isCritical ? " CRITICAL HIT!" : "";
              addCombatMessage(`You hit ${currentTarget.value.name} for ${result.playerDamage} damage!${critText}`, 
                              result.isCritical ? 'critical' : 'success');
            }
            
            if (result.monsterDamage) {
              const critText = result.monsterCritical ? " CRITICAL HIT!" : "";
              addCombatMessage(`${currentTarget.value.name} hits you for ${result.monsterDamage} damage!${critText}`, 
                              result.monsterCritical ? 'critical' : 'danger');
            }
            
            // Check if monster died
            if (result.monsterDied) {
              addCombatMessage(`You have defeated ${currentTarget.value.name}!`, 'success');
              
              // Show rewards
              if (result.experienceGained) {
                addCombatMessage(`You gained ${result.experienceGained} experience points.`, 'reward');
              }
              
              if (result.goldGained) {
                addCombatMessage(`You received ${result.goldGained} gold.`, 'reward');
              }
              
              if (result.loot && result.loot.length > 0) {
                result.loot.forEach(item => {
                  addCombatMessage(`You received: ${item.name} x${item.quantity}`, 'item');
                });
              }
              
              // Update player data in store if full update is provided
              if (result.playerData) {
                store.commit('setPlayer', result.playerData);
              }
              
              // Handle inventory updates
              if (result.type === 'getInventory' && result.inventory) {
                // Update player inventory with detailed item information
                const updatedPlayer = { ...props.player };
                updatedPlayer.character.inventory = result.inventory;
                
                if (result.equipment) {
                  updatedPlayer.character.equipment = result.equipment;
                }
                
                if (result.gold) {
                  updatedPlayer.character.gold = result.gold;
                }
                
                store.commit('setPlayer', updatedPlayer);
                addGameMessage("Inventory updated", 'success');
              }
              
              // Handle player stats updates
              if (result.type === 'getPlayerStats' && result.stats) {
                const updatedPlayer = { ...props.player };
                
                // Update basic stats
                if (result.level) updatedPlayer.character.level = result.level;
                if (result.experience) updatedPlayer.character.experience = result.experience;
                if (result.experienceToNextLevel) updatedPlayer.character.experienceToNextLevel = result.experienceToNextLevel;
                
                // Update attributes
                if (result.attributes) {
                  updatedPlayer.character.attributes = { 
                    ...updatedPlayer.character.attributes,
                    ...result.attributes 
                  };
                }
                
                // Update combat stats
                if (result.stats) {
                  updatedPlayer.character.stats = { 
                    ...updatedPlayer.character.stats,
                    ...result.stats 
                  };
                }
                
                // Update health and mana
                if (result.health) {
                  updatedPlayer.character.health = { 
                    ...updatedPlayer.character.health,
                    ...result.health 
                  };
                }
                
                if (result.mana) {
                  updatedPlayer.character.mana = { 
                    ...updatedPlayer.character.mana,
                    ...result.mana 
                  };
                }
                
                // Update resistances
                if (result.resistances) {
                  updatedPlayer.character.resistances = { 
                    ...updatedPlayer.character.resistances,
                    ...result.resistances 
                  };
                }
                
                store.commit('setPlayer', updatedPlayer);
                addGameMessage("Character stats updated", 'success');
              }
              
              // Handle level up
              if (result.levelUp) {
                addCombatMessage(`LEVEL UP! You are now level ${result.newLevel}.`, 'levelup');
              }
              
              // End combat (pass true to indicate victory, not retreat)
              stopCombat(true);
            }
            
            // Check if player died
            if (result.playerDied) {
              addCombatMessage('You have been defeated!', 'danger');
              stopCombat();
            }
          }
          
          // Handle zone information
          if (result.zone) {
            console.log('Received zone data:', result.zone);
            
            // Ensure the zone has a connections array
            if (!result.zone.connections) {
              result.zone.connections = [];
              console.warn('Zone is missing connections array');
            }
            
            // Store the zone information in both component and Vuex store
            currentZone.value = result.zone;
            store.commit('setCurrentZone', result.zone);
            
            // Check if there are zone entities
            if (result.zone.entities) {
              console.log('Zone entities:', result.zone.entities);
              zoneEntities.value = result.zone.entities;
            } else {
              console.warn('No entities found in zone');
              zoneEntities.value = [];
            }
            
            // Create some test entities if none exist and we're in development mode
            if (zoneEntities.value.length === 0 && process.env.NODE_ENV === 'development') {
              console.log('Creating test monsters for development');
              zoneEntities.value = [
                {
                  id: 'test-monster-1',
                  name: 'Test Wolf',
                  type: 'monster',
                  level: 1,
                  description: 'A fierce wolf with grey fur and sharp fangs.'
                },
                {
                  id: 'test-monster-2',
                  name: 'Test Goblin',
                  type: 'monster',
                  level: 2,
                  description: 'A small green creature with a wicked grin.'
                }
              ];
            }
            
            // Generate new grid map for this zone
            generateGridFromZone();
            
            // Display zone information
            addGameMessage(`You are now in ${result.zone.displayName}`, 'info');
            addGameMessage(result.zone.description, 'info');
            
            // Add game message to store for other components
            store.commit('addGameMessage', { 
              text: `Entered zone: ${result.zone.displayName}`, 
              type: 'info'
            });
            
            // List available exits
            if (result.zone.connections && result.zone.connections.length > 0) {
              addGameMessage('Available exits:', 'info');
              result.zone.connections.forEach(conn => {
                addGameMessage(`- ${conn.direction}: ${conn.description}`, 'info');
              });
            } else {
              addGameMessage('There are no visible exits from here.', 'warning');
            }
          }
          
          // If player data is updated (like after combat or item use)
          if (result.playerData) {
            store.commit('setPlayer', result.playerData);
            
            // Update inventory in store
            if (result.playerData.character && result.playerData.character.inventory) {
              store.commit('updateInventory', result.playerData.character.inventory);
            }
          }
        } else {
          addGameMessage(result.message, 'warning');
          
          // If combat action failed, stop combat
          if (inCombat.value) {
            stopCombat();
          }
        }
      });
      
      socket.value.on('chat:message', (message) => {
        // Check if this is a message from the current player that was already added locally
        if (message.playerId === 'self' || 
            (message.playerId === socket.value.id && 
             message.timestamp && 
             chatMessages.value.some(m => 
               m.playerId === 'self' && 
               m.content === message.content && 
               Math.abs(m.timestamp - message.timestamp) < 1000))) {
          // Skip adding duplicate message, just scroll
          scrollChatToBottom();
          return;
        }
        
        // Add message from server
        chatMessages.value.push(message);
        
        // Scroll chat to bottom
        scrollChatToBottom();
      });
      
      socket.value.on('error', (error) => {
        addGameMessage(`Error: ${error.message}`, 'error');
      });
      
      socket.value.on('disconnect', () => {
        addGameMessage('Disconnected from server', 'system');
      });
    };
    
    // Add a message to the game output
    const addGameMessage = (text, type = 'info') => {
      // Add to local messages
      gameMessages.value.push({ text, type });
      
      // Add to store messages (except routine messages)
      if (['system', 'error', 'success', 'warning', 'reward', 'levelup', 'combat-critical'].includes(type)) {
        store.commit('addGameMessage', { text, type });
      }
      
      // Scroll to bottom
      setTimeout(() => {
        const messageDiv = document.querySelector('.game-messages');
        if (messageDiv) {
          messageDiv.scrollTop = messageDiv.scrollHeight;
        }
      }, 50);
    };
    
    // Scroll chat to bottom
    const scrollChatToBottom = () => {
      setTimeout(() => {
        const chatDiv = document.querySelector('.chronicle-messages');
        if (chatDiv) {
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }
      }, 50);
    };
    
    // Move to a direction
    const moveToDirection = (direction) => {
      if (!socket.value) {
        addGameMessage("Can't move - not connected to server", 'error');
        console.error("Movement failed: No socket connection");
        return;
      }
      
      if (!currentZone.value) {
        addGameMessage("Can't move - zone not loaded yet", 'warning');
        console.error("Movement failed: Zone not loaded");
        // Try to get zone info if not loaded
        getZoneInfo();
        return;
      }
      
      // Ensure connections array exists
      if (!currentZone.value.connections || !Array.isArray(currentZone.value.connections)) {
        currentZone.value.connections = [];
        console.error("No connections array, creating empty one");
      }
      
      // Debug message to verify the direction and connections
      console.log(`Moving: ${direction}`, currentZone.value.connections);
      addGameMessage(`Attempting to move ${direction}...`, 'info');
      
      // First try local movement within the zone
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      
      // Calculate new position based on direction
      switch(direction.toLowerCase()) {
        case 'north':
          newY--;
          break;
        case 'south':
          newY++;
          break;
        case 'east':
          newX++;
          break;
        case 'west':
          newX--;
          break;
      }
      
      console.log(`Trying to move from (${playerPosition.x},${playerPosition.y}) to (${newX},${newY})`);
      
      // Check if new position is within bounds
      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        console.log(`Position (${newX},${newY}) out of bounds, checking zone exits`);
        
        // Try to use a zone connection if at boundary
        const connection = currentZone.value.connections.find(
          conn => conn.direction.toLowerCase() === direction.toLowerCase()
        );
        
        if (connection) {
          addGameMessage(`Found exit to ${connection.zoneName}`, 'info');
          moveToZone(connection.zoneName);
        } else {
          addGameMessage(`You can't go any further ${direction}`, 'warning');
        }
        return;
      }
      
      // Check if new position is a wall
      if (gridMap.value[newY][newX].type === 'wall') {
        // Check if there's a door here
        if (gridMap.value[newY][newX].type === 'door') {
          const connection = currentZone.value.connections.find(
            conn => conn.direction.toLowerCase() === direction.toLowerCase()
          );
          
          if (connection) {
            addGameMessage(`Found exit to ${connection.zoneName}`, 'info');
            moveToZone(connection.zoneName);
            return;
          }
        }
        
        addGameMessage(`There's a wall blocking your path ${direction}`, 'warning');
        console.log(`Wall at (${newX},${newY})`);
        return;
      }
      
      // Move player to new position
      playerPosition.x = newX;
      playerPosition.y = newY;
      updatePlayerPosition();
      addGameMessage(`You move ${direction}`, 'info');
      console.log(`Player now at (${playerPosition.x},${playerPosition.y})`);
    };
    
    // Move to a specific zone
    const moveToZone = (zoneName) => {
      if (!socket.value) {
        addGameMessage("Can't move - not connected to server", 'error');
        return;
      }
      
      addGameMessage(`Moving to ${zoneName}...`, 'info');
      socket.value.emit('player:action', {
        type: 'move',
        destination: zoneName
      });
    };
    
    // Attack a target
    const attackTarget = (targetName) => {
      const target = zoneEntities.value.find(
        entity => entity.name.toLowerCase().includes(targetName.toLowerCase())
      );
      
      if (target && target.type === 'monster') {
        socket.value.emit('player:action', {
          type: 'attack',
          monsterId: target.id
        });
      } else {
        addGameMessage(`Cannot find target: ${targetName}`, 'warning');
      }
    };
    
    // Interact with an entity in the zone
    const interactWithEntity = (entity) => {
      if (entity.type === 'monster') {
        if (inCombat.value) {
          addGameMessage("You're already in combat!", 'warning');
          return;
        }
        
        addGameMessage(`You prepare to fight ${entity.name}`, 'info');
        startCombat(entity);
      } else if (entity.type === 'npc') {
        addGameMessage(`You talk to ${entity.name}`, 'info');
        socket.value.emit('player:action', {
          type: 'talk',
          npcId: entity.id
        });
      } else if (entity.type === 'resource') {
        addGameMessage(`You gather from ${entity.name}`, 'info');
        socket.value.emit('player:action', {
          type: 'gather',
          resourceId: entity.id
        });
      }
    };
    
    // Chat system enhancements
    const chatChannels = ref([
      { label: 'All', value: 'all' },
      { label: 'Global', value: 'global' },
      { label: 'Zone', value: 'zone' },
      { label: 'Private', value: 'private' }
    ]);
    
    const selectedChatChannel = ref('all');
    const showTimestamps = ref(false);
    const privateTarget = ref('');
    
    // Format timestamp for chat messages
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `[${hours}:${minutes}]`;
    };
    
    // Toggle timestamp display
    const toggleTimestamps = () => {
      showTimestamps.value = !showTimestamps.value;
    };
    
    // Filter chat messages based on selected channel
    const filteredChatMessages = computed(() => {
      if (selectedChatChannel.value === 'all') {
        return chatMessages.value;
      }
      return chatMessages.value.filter(msg => msg.scope === selectedChatChannel.value);
    });
    
    // Send chat message
    const sendChatMessage = () => {
      if (!chatInput.value.trim()) return;
      
      const message = {
        content: chatInput.value.trim(),
        playerName: props.player.character.name,
        scope: chatScope.value,
        zone: currentZone.value ? currentZone.value.name : null,
        timestamp: Date.now()
      };
      
      // Handle private messages with the target input field
      if (chatScope.value === 'private') {
        if (privateTarget.value.trim()) {
          message.targetName = privateTarget.value.trim();
        } else {
          // Check if there's an inline target like "/w targetName message"
          if (message.content.startsWith('/w ') || message.content.startsWith('/whisper ')) {
            const parts = message.content.replace(/^\/w(hisper)?\s+/, '').trim().split(' ');
            if (parts.length >= 2) {
              message.targetName = parts[0];
              message.content = parts.slice(1).join(' ');
            } else {
              addGameMessage("Please specify a target for your private message.", 'warning');
              return;
            }
          } else {
            addGameMessage("Please specify a target for your private message.", 'warning');
            return;
          }
        }
      }
      
      // Add to local message list immediately for better UX
      chatMessages.value.push({
        playerId: 'self',
        playerName: props.player.character.name,
        content: message.content,
        scope: message.scope,
        timestamp: message.timestamp
      });
      
      // Scroll to bottom
      scrollChatToBottom();
      
      // Send to server
      socket.value.emit('chat:message', message);
      chatInput.value = '';
    };
    
    // Track hovered item for tooltips
    const hoveredItem = ref(null);
    
    // Format attribute names for display
    const formatAttributeName = (key) => {
      return key.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('Bonus', '');
    };
    
    // Capitalize first letter
    const capitalizeFirst = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    // Item display helper methods
    const getItemName = (item) => {
      // Check if the item has a direct name property
      if (item.name) return item.name;
      
      // Convert itemId to a nice display name if no name provided
      if (item.itemId) {
        const idName = item.itemId.toString().replace(/-/g, ' ');
        return capitalizeFirst(idName);
      }
      
      return 'Unknown Item';
    };
    
    const getItemType = (item) => {
      // Return type if available
      if (item.type) return item.type;
      
      // Try to guess type from itemId
      if (item.itemId) {
        if (item.itemId.includes('sword') || 
            item.itemId.includes('axe') || 
            item.itemId.includes('dagger') ||
            item.itemId.includes('staff')) {
          return 'weapon';
        }
        
        if (item.itemId.includes('armor') || 
            item.itemId.includes('helm') || 
            item.itemId.includes('boots') ||
            item.itemId.includes('shield')) {
          return 'armor';
        }
        
        if (item.itemId.includes('potion') || 
            item.itemId.includes('food') || 
            item.itemId.includes('herb')) {
          return 'consumable';
        }
      }
      
      return 'miscellaneous';
    };
    
    const getItemDescription = (item) => {
      if (item.description) return item.description;
      return `A ${getItemType(item)} that you obtained during your adventures.`;
    };
    
    const getItemRarityClass = (item) => {
      // If item has rarity property, use it
      if (item.rarity) {
        return {
          'item-common': item.rarity === 'common',
          'item-uncommon': item.rarity === 'uncommon',
          'item-rare': item.rarity === 'rare',
          'item-epic': item.rarity === 'epic',
          'item-legendary': item.rarity === 'legendary'
        };
      }
      
      // Default to common
      return { 'item-common': true };
    };
    
    const hasItemAttributes = (item) => {
      return item.attributes || 
             getItemType(item) === 'weapon' || 
             getItemType(item) === 'armor';
    };
    
    const getItemDamage = (item) => {
      if (item.attributes && item.attributes.damage) {
        return `${item.attributes.damage.min}-${item.attributes.damage.max}`;
      }
      
      // Default values based on item type
      if (getItemType(item) === 'weapon') {
        return '1-3';
      }
      
      return null;
    };
    
    const getItemDefense = (item) => {
      if (item.attributes && item.attributes.defense) {
        return item.attributes.defense;
      }
      
      // Default values based on item type
      if (getItemType(item) === 'armor') {
        return 2;
      }
      
      return null;
    };
    
    const getRequiredLevel = (item) => {
      return item.requiredLevel || 1;
    };
    
    const getItemValue = (item) => {
      return item.value || 1;
    };
    
    // Use an item from inventory
    const useItem = (item) => {
      const itemName = getItemName(item);
      addGameMessage(`Using item: ${itemName}`, 'info');
      socket.value.emit('player:action', {
        type: 'useItem',
        itemId: item.itemId
      });
    };
    
    // Refresh inventory data from server
    const refreshInventory = () => {
      if (!socket.value) {
        addGameMessage("Can't refresh inventory - not connected to server", 'error');
        return;
      }
      
      addGameMessage("Refreshing inventory...", 'system');
      console.log("Requesting inventory update from server");
      
      // Request inventory from server
      socket.value.emit('player:action', {
        type: 'getInventory'
      });
      
      // Add a debug log to check what's in inventory currently
      console.log("Current inventory:", props.player.character.inventory);
    };
    
    // Refresh player stats from server
    const refreshPlayerStats = () => {
      if (!socket.value) return;
      
      addGameMessage("Refreshing character stats...", 'system');
      socket.value.emit('player:action', {
        type: 'getPlayerStats'
      });
    };
    
    // Watch for zone changes to update the grid
    watch(currentZone, (newZone) => {
      if (newZone) {
        generateGridFromZone();
      }
    });
    
    // Start combat with a monster
    const startCombat = (monster) => {
      if (inCombat.value) {
        addGameMessage("You're already in combat!", 'warning');
        return;
      }

      // Verify monster exists in this zone
      const targetMonster = zoneEntities.value.find(entity => 
        entity.type === 'monster' && entity.id === monster.id
      );
      
      if (!targetMonster) {
        addGameMessage("That monster is not in this zone.", 'error');
        return;
      }

      // Calculate initial monster health based on level if available
      const monsterLevel = targetMonster.level || 1;
      const monsterHealthMax = targetMonster.healthMax || (monsterLevel * 20 + 50); // Simple formula
      
      // Initialize combat state
      inCombat.value = true;
      currentTarget.value = {
        id: monster.id,
        name: monster.name,
        level: monsterLevel,
        description: monster.description || "A fearsome creature",
        health: { current: monsterHealthMax, max: monsterHealthMax } 
      };
      combatLog.value = [];
      combatTurn.value = 1;
      
      // Add initial combat message
      addCombatMessage(`Combat started with ${monster.name} (Level ${monsterLevel})!`, 'system');
      addCombatMessage(`You prepare to fight the ${monster.name}.`, 'info');
      
      // Log to store
      store.commit('addGameMessage', {
        text: `Entered combat with ${monster.name} (Level ${monsterLevel})`,
        type: 'combat-system'
      });
      
      // Send initial attack to server
      socket.value.emit('player:action', {
        type: 'attack',
        monsterId: monster.id
      });
      
      // Start automatic combat
      combatInterval.value = setInterval(() => {
        performCombatTurn();
      }, 3000); // Combat turn every 3 seconds
    };

    // Perform a combat turn
    const performCombatTurn = () => {
      if (!inCombat.value || !currentTarget.value) {
        stopCombat();
        return;
      }
      
      // Send attack action to server
      socket.value.emit('player:action', {
        type: 'attack',
        monsterId: currentTarget.value.id
      });
      
      // Increment turn counter
      combatTurn.value++;
    };

    // Stop combat
    const stopCombat = (isVictory = false) => {
      if (combatInterval.value) {
        clearInterval(combatInterval.value);
        combatInterval.value = null;
      }
      
      if (inCombat.value) {
        if (!isVictory) {
          addCombatMessage("You retreat from combat.", 'warning');
          addGameMessage(`You retreat from fighting ${currentTarget.value.name}.`, 'warning');
        }
        inCombat.value = false;
        currentTarget.value = null;
      }
    };

    // Add a message to the combat log
    const addCombatMessage = (text, type = 'info') => {
      // Add to the combat log array for reference
      combatLog.value.push({ text, type });
      
      // Also add to the main game messages with a special combat prefix
      addGameMessage(`[Combat] ${text}`, `combat-${type}`);
    };
    
    // Initial setup
    onMounted(() => {
      // Initialize empty grid first
      initGridMap();

      // Connect to server and then request zone info when connected
      connectToServer();
      
      // Add welcome message
      addGameMessage('Welcome to Fantasy Text MMORPG!', 'system');
      addGameMessage('Use the directional buttons to navigate.', 'system');
      addGameMessage('Loading zone information...', 'system');
      
      // Check store for current zone
      if (store.state.currentZone) {
        currentZone.value = store.state.currentZone;
        generateGridFromZone();
      }
    });
    
    // Cleanup
    onUnmounted(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
      
      // Clean up combat interval if it exists
      if (combatInterval.value) {
        clearInterval(combatInterval.value);
        combatInterval.value = null;
      }
    });
    
    return {
      gameTitle,
      gameMessages,
      chatMessages,
      chatInput,
      chatScope,
      currentZone,
      zoneEntities,
      sendChatMessage,
      moveToZone,
      moveToDirection,
      interactWithEntity,
      useItem,
      refreshInventory,
      refreshPlayerStats,
      gridMap,
      getCellSymbol,
      getEntityMarker,
      interactWithCell,
      getZoneInfo,
      playerPosition,
      gridSize,
      inCombat,
      currentTarget,
      combatLog,
      combatInterval,
      combatTurn,
      startCombat,
      stopCombat,
      addCombatMessage,
      hoveredItem,
      formatAttributeName,
      capitalizeFirst,
      // Item display helpers
      getItemName,
      getItemType,
      getItemDescription,
      getItemRarityClass,
      hasItemAttributes,
      getItemDamage,
      getItemDefense,
      getRequiredLevel,
      getItemValue,
      // New Chronicle (chat) system
      chatChannels,
      selectedChatChannel,
      filteredChatMessages,
      showTimestamps,
      toggleTimestamps,
      formatTimestamp,
      privateTarget
    };
  }
};
</script>

<style scoped>
.game-interface {
  font-family: 'Courier New', monospace;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #f0f0f0;
}

.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
}

.game-header {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #444;
}

.game-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.game-panel {
  padding: 10px;
  border: 1px solid #444;
  margin: 5px;
  background-color: #262626;
  box-sizing: border-box;
}

.left-panel {
  width: 250px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.player-info {
  margin-bottom: 15px;
}

.main-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.right-panel {
  width: 250px;
  display: flex;
  flex-direction: column;
}

/* Grid Map Styling */
.map-section {
  flex: 1;
  padding: 10px;
  border: 1px solid #444;
  background-color: #222;
  border-radius: 4px;
}

.map-section h3 {
  text-align: center;
  margin-bottom: 10px;
  color: #8b5cf6; /* Purple accent */
}

.player-position {
  font-size: 0.9em;
  color: #aaffaa;
  margin-bottom: 10px;
  text-align: center;
  background-color: #333;
  padding: 5px;
  border-radius: 3px;
}

.grid-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.map-row {
  display: flex;
}

.map-cell {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.map-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 0 5px rgba(139, 92, 246, 0.7);
}

.cell-wall {
  background-color: #444;
  color: #666;
}

.cell-path {
  background-color: #282828;
  color: #ddd;
}

.cell-player {
  background-color: #3b82f6; /* Blue */
  color: white;
}

.cell-entity {
  background-color: #10b981; /* Green */
  color: white;
}

.player-marker, .entity-marker {
  font-weight: bold;
}

/* Direction Controls */
.direction-controls {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.direction-row {
  display: flex;
  justify-content: center;
}

.direction-btn {
  width: 80px;
  height: 40px;
  margin: 5px;
  background-color: #3b82f6; /* Blue */
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.direction-btn:hover {
  background-color: #2563eb; /* Darker blue */
  transform: scale(1.05);
}

.center-btn {
  width: 80px;
  height: 40px;
  margin: 5px;
}

.north-btn { 
  border-radius: 20px 20px 4px 4px;
}

.south-btn {
  border-radius: 4px 4px 20px 20px;
}

.west-btn {
  border-radius: 20px 4px 4px 20px;
}

.east-btn {
  border-radius: 4px 20px 20px 4px;
}

.zone-description {
  margin-top: 10px;
  padding: 10px;
  background-color: #2d2d2d;
  border-radius: 4px;
  font-style: italic;
}

/* Game Messages */
.game-output {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #444;
  background-color: #111;
  display: flex;
  flex-direction: column;
  min-height: 150px;
}

.game-messages {
  flex: 1;
  overflow-y: auto;
}

.game-message {
  margin: 5px 0;
  word-wrap: break-word;
}

.game-message.system {
  color: #a0a0a0;
}

.game-message.command {
  color: #ffcc00;
}

.game-message.info {
  color: #ffffff;
}

.game-message.success {
  color: #00cc00;
}

.game-message.warning {
  color: #ffaa00;
}

.game-message.error {
  color: #ff0000;
}

.game-message.reward {
  color: #00ccff;
}

.game-message.item {
  color: #cc00ff;
}

.game-message.levelup {
  color: #ffff00;
  font-weight: bold;
}

.game-message.danger {
  color: #ff0000;
  font-weight: bold;
}

.combat-status {
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  border-radius: 4px;
}

.combat-header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.combat-label {
  font-weight: bold;
  color: #8b5cf6;
}

.stop-combat-btn-small {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
}

.health-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.health-bar-small {
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 3px;
}

.health-fill-small {
  height: 100%;
  transition: width 0.3s;
}

.player-health {
  background-color: #3b82f6;
}

.monster-health {
  background-color: #dc2626;
}

.game-message.combat-info {
  color: #8b5cf6;
}

.game-message.combat-success {
  color: #10b981;
}

.game-message.combat-warning {
  color: #f59e0b;
}

.game-message.combat-danger {
  color: #dc2626;
}

.game-message.combat-system {
  color: #8b5cf6;
  font-style: italic;
}

.game-message.combat-critical {
  color: #ffdd00;
  font-weight: bold;
  text-shadow: 0 0 3px #ff0000;
}

/* Zone Entities */
.zone-entities {
  height: 100%;
  padding: 10px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.zone-entities h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #f59e0b;
  text-align: center;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.entity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

.entity-item {
  padding: 8px 12px;
  background-color: #333;
  border-radius: 4px;
  border-left: 3px solid #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.entity-item:hover {
  background-color: #3a3a3a;
  border-left-color: #8b5cf6;
}

.monster-entity {
  border-left-color: #dc2626;
}

.entity-name {
  font-weight: bold;
}

.attack-btn {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.attack-btn:hover:not(:disabled) {
  background-color: #b91c1c;
  transform: scale(1.05);
}

.attack-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

/* Chronicle (Chat) System */
.chronicle-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #444;
  background-color: #222;
  margin-bottom: 10px;
  overflow: hidden;
}

.chronicle-header {
  padding: 8px 10px;
  border-bottom: 1px solid #444;
  background-color: #2a2a2a;
  display: flex;
  flex-direction: column;
}

.chronicle-header h3 {
  margin: 0 0 8px 0;
  text-align: center;
  color: #ffcc00;
  font-size: 16px;
}

.channel-tabs {
  display: flex;
  gap: 2px;
}

.channel-tab {
  padding: 4px 8px;
  border-radius: 4px 4px 0 0;
  background-color: #333;
  color: #aaa;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s;
}

.channel-tab:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.channel-tab.active {
  background-color: #444;
  color: #ffcc00;
  font-weight: bold;
}

.chronicle-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background-color: #111;
  font-family: 'Courier New', monospace;
  min-height: 150px;
}

.chronicle-entry {
  margin: 4px 0;
  word-wrap: break-word;
  line-height: 1.4;
  padding: 2px 4px;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.chronicle-entry:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.message-timestamp {
  font-size: 0.75em;
  color: #666;
  margin-right: 5px;
}

.message-sender {
  font-weight: bold;
  margin-right: 5px;
}

.sender-global {
  color: #ffcc00;
}

.sender-zone {
  color: #00ccff;
}

.sender-private {
  color: #ff00cc;
}

.message-content {
  color: #ddd;
}

.chronicle-entry.global {
  /* you can add specific styling for global messages */
}

.chronicle-entry.zone {
  /* styling for zone messages */
}

.chronicle-entry.private {
  background-color: rgba(255, 0, 200, 0.05);
}

.chronicle-input {
  padding: 8px;
  background-color: #2a2a2a;
  border-top: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-select {
  width: 80px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 3px;
  font-size: 0.9em;
}

.input-target {
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 0.9em;
  gap: 4px;
}

.target-input {
  width: 100px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 3px;
  font-size: 0.9em;
}

.timestamp-toggle {
  margin-left: auto;
  background-color: #333;
  color: #aaa;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 2px 5px;
  cursor: pointer;
  font-size: 0.8em;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timestamp-toggle.active {
  background-color: #444;
  color: #fff;
}

.input-field {
  display: flex;
  gap: 5px;
}

.chronicle-text-input {
  flex: 1;
  padding: 6px 8px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 3px;
  font-family: inherit;
}

.chronicle-send-button {
  padding: 6px 12px;
  background-color: #4c6b22;
  color: #fff;
  border: 1px solid #5d8228;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.chronicle-send-button:hover {
  background-color: #5d8228;
}

.inventory-panel {
  flex: 1;
  border: 1px solid #444;
  background-color: #333;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #ffcc00;
  font-weight: bold;
  padding-bottom: 5px;
  border-bottom: 1px solid #444;
}

.refresh-btn {
  background-color: transparent;
  color: #aaa;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
}

.refresh-btn:hover {
  background-color: #444;
  color: #fff;
}

.inventory-list {
  height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-inventory {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.empty-message {
  color: #999;
  font-style: italic;
}

.inventory-item {
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #2a2a2a;
  border-radius: 3px;
  border-left: 3px solid #666;
  position: relative;
}

.item-name {
  font-weight: bold;
}

.item-type {
  font-size: 0.8em;
  color: #aaa;
}

.inventory-item:hover {
  background-color: #3a3a3a;
  transform: translateX(2px);
}

.item-common {
  border-left-color: #999;
}

.item-uncommon {
  border-left-color: #1eb53a;
}

.item-rare {
  border-left-color: #3873e0;
}

.item-epic {
  border-left-color: #9b59b6;
}

.item-legendary {
  border-left-color: #f39c12;
}

.item-tooltip {
  position: absolute;
  left: calc(100% + 5px);
  top: 0;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid #555;
  border-radius: 4px;
  padding: 8px;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.tooltip-header {
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
  font-size: 1.1em;
}

.tooltip-type {
  color: #aaa;
  font-size: 0.9em;
  font-style: italic;
  margin-bottom: 6px;
}

.tooltip-description {
  color: #ddd;
  margin-bottom: 6px;
  font-size: 0.9em;
  border-top: 1px dotted #555;
  padding-top: 6px;
}

.tooltip-attributes {
  color: #5cb85c;
  font-size: 0.9em;
  margin-bottom: 6px;
}

.tooltip-required {
  color: #d9534f;
  font-size: 0.9em;
  margin-bottom: 6px;
}

.tooltip-value {
  color: #ffcc00;
  font-size: 0.9em;
  margin-bottom: 6px;
}

.tooltip-instructions {
  color: #aaa;
  font-size: 0.8em;
  font-style: italic;
  margin-top: 6px;
  border-top: 1px dotted #555;
  padding-top: 6px;
}

.main-content {
  display: flex;
  margin-bottom: 15px;
  gap: 15px;
}

.monsters-section {
  width: 250px;
  display: flex;
  flex-direction: column;
}

.player-attributes {
  background-color: #333;
  border-radius: 5px;
  padding: 8px;
  margin-top: 10px;
}

.attr-row {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.attr-label {
  color: #aaa;
  width: 30px;
}

.attr-value {
  color: #fff;
  font-weight: bold;
  width: 20px;
  text-align: center;
  margin-right: 15px;
}

.player-info {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-header {
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.player-header h3 {
  margin-bottom: 4px;
  color: #ffcc00;
}

.player-class {
  font-size: 0.9em;
  color: #aaa;
  font-style: italic;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.progress-label {
  width: 60px;
  font-size: 0.9em;
  color: #ddd;
}

.progress-value {
  width: 80px;
  font-size: 0.9em;
  text-align: right;
  color: #ddd;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

.xp-fill {
  background-color: #8b5cf6;
}

.hp-fill {
  background-color: #ef4444;
}

.mp-fill {
  background-color: #3b82f6;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-section {
  background-color: #2d2d2d;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #444;
}

.stats-header {
  background-color: #333;
  padding: 4px 8px;
  font-weight: bold;
  font-size: 0.9em;
  color: #ffcc00;
  border-bottom: 1px solid #444;
}

.combat-stats, .resistances {
  padding: 8px;
}

.stat-row, .resist-row {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.stat-label, .resist-label {
  color: #aaa;
  font-size: 0.9em;
}

.stat-value, .resist-value {
  color: #fff;
  font-weight: bold;
  font-size: 0.9em;
}

.refresh-stats-btn {
  background-color: #333;
  color: #ddd;
  border: 1px solid #444;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
  text-align: center;
  margin-top: 5px;
}

.refresh-stats-btn:hover {
  background-color: #444;
  color: #fff;
}
</style> 
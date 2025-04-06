// Import game service
const GameService = require('./services/gameService');
const http = require('http');

// Import WebSocket handler
const WebSocketHandler = require('./websocket');

// Create HTTP server
const server = http.createServer(app);

// Initialize the game service
const gameService = new GameService();

// Initialize WebSocket handler
const webSocketHandler = new WebSocketHandler(server, gameService);

// Connect game service to websocket for notifications
gameService.notifyZoneUpdate = (zoneId, data) => {
  webSocketHandler.notifyZoneUpdate(zoneId, data);
};

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize the game service after server start
  await gameService.initialize();
  console.log('Game world initialized and ready for players');
}); 
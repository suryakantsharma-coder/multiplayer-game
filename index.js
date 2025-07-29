const handleConnection = require('./handlers/connectionHandler');
const { createWebSocketServer} = require('./config/wsConfig');

const wss = createWebSocketServer(8080);

wss.on('connection', (socket) => {
  handleConnection(socket, wss);
});

console.log('🎮 Server running on ws://localhost:8080');

const { v4: uuidv4 } = require('uuid');
const handleMessage = require('./messageHandler');

function handleConnection(socket, wss) {
  socket.id = uuidv4();
  socket.roomId = null;

  socket.on('message', (message) => handleMessage(socket, message));
  socket.on('close', () => {
    const roomManager = require('../utils/roomManager');
    roomManager.removePlayerFromRoom(socket.roomId, socket);
  });
}

module.exports = handleConnection;

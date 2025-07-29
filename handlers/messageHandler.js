const roomManager = require('../utils/roomManager');

function handleMessage(socket, message) {
  try {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'CREATE_ROOM':
        roomManager.createRoom(socket);
        break;
      case 'JOIN_ROOM':
        roomManager.joinRoom(data.roomId, socket);
        roomManager.joinedRoom(data.roomId, socket);
        break;
      
      case "WINNER":
        roomManager.winner(socket, data.payload);
        break;
      case "TIE":
        roomManager.tie(socket, data.payload);
        break;
      case 'GAME_ACTION':
        roomManager.broadcastToRoom(socket, data.payload);
        break;
      case 'ROOM_MESSAGE':
        roomManager.broadcastToRoom(socket, data.payload);
        break;
      case 'START_GAME':
        roomManager.startGame(socket, data.payload);
        break;
      case 'END_GAME':
        roomManager.endGame(socket.roomId);
        break;
      default:
        socket.send(JSON.stringify({ type: 'ERROR', message: 'Unknown command' }));
    }
  } catch {
    socket.send(JSON.stringify({ type: 'ERROR', message: 'Invalid message format' }));
  }
}

module.exports = handleMessage;

const rooms = require('../data/rooms');

function createRoom(socket) {
  const roomId = require('uuid').v4();
  rooms[roomId] = { players: [socket] };
  socket.roomId = roomId;
  socket.send(JSON.stringify({ type: 'CREATE_ROOM', roomId, players: [socket.id] }));
}

function joinRoom(roomId, socket) {
  const room = rooms[roomId];
  if (!room || room.players.length >= 2) {
    socket.send(JSON.stringify({ type: 'ERROR', message: 'Room full or not found' }));
    return;
  }

  room.players.push(socket);
  socket.roomId = roomId;

  room.players.forEach((player) =>
    player.send(JSON.stringify({ type: 'JOIN_ROOM', roomId, players: room.players.map(p => p.id) }))
  );
}

function joinedRoom(roomId, socket) {
  const room = rooms[roomId];
  const opponent = room.players.find(player => player !== socket);
  if (room) {
    opponent.send(JSON.stringify({ type: 'JOINNED', roomId, players: room.players.map(p => p.id) }));
  }
}
function startGame(sender, payload) {
   const room = rooms[sender.roomId];
  if (room) {
    room.players.forEach((player) => {
      if (player !== sender) {
        player.send(JSON.stringify({ type: 'START_GAME', from: sender.id, payload }));
      }
    });
  } 
}

function broadcastToRoom(sender, payload) {
  const room = rooms[sender.roomId];
  if (room) {
    room.players.forEach((player) => {
      if (player !== sender) {
        player.send(JSON.stringify({ type: 'ROOM_MESSAGE', from: sender.id, payload }));
      }
    });
  }
}

function winner(sender, payload) {
  const room = rooms[sender.roomId];
  if (room) {
    room.players.forEach((player) => {
      player.send(JSON.stringify({ type: 'WINNER', roomId: sender.roomId, payload }));
    });
  }
}

function tie(sender, payload) {
  const room = rooms[sender.roomId];
  if (room) {
    room.players.forEach((player) => {
      if (player !== sender) {
        player.send(JSON.stringify({ type: 'TIE', from: sender.id, payload }));
      }
    });
  }
}

function endGame(roomId) {
  const room = rooms[roomId];
  if (room) {
    room.players.forEach((player) => {
      player.send(JSON.stringify({ type: 'END_GAME', roomId }));
      // Optional: player.close();
    });
    delete rooms[roomId];
    console.log(`🗑️ Room ${roomId} deleted (game ended)`);
  }
}

function removePlayerFromRoom(roomId, socket) {
  const room = rooms[roomId];
  if (room) {
    room.players = room.players.filter((p) => p !== socket);
    if (room.players.length === 0) {
      delete rooms[roomId];
      console.log(`🧹 Room ${roomId} deleted (disconnected)`);
    }
  }
}

module.exports = {
  createRoom,
  joinRoom,
  joinedRoom,
  broadcastToRoom,
  winner,
  tie,
  startGame,
  endGame,
  removePlayerFromRoom
};

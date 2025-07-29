const WebSocket = require('ws');

function createWebSocketServer(port) {
  return new WebSocket.Server({ port });
}

module.exports = { createWebSocketServer };

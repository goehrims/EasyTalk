const WebSocket = require('ws');

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8513 });

// Listen for connection events
wss.on('connection', (ws) => {
  console.log('A new client connected!');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log('received: %s', message);

    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${message}`);
      }
    });
  });

  // Send a welcome message to the new client
  ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is listening on ws://localhost:8080');

const net = require('net');

// Create a TCP server
const server = net.createServer();

// Map to store connected clients and their information
const clientsMap = new Map();

// Event handler for when a client connects
server.on('connection', (socket) => {
  console.log('Client connected:', socket.remoteAddress, socket.remotePort);

  // Generate a unique client ID (you can customize this based on your needs)
  const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

  // Store client information in the map
  clientsMap.set(clientId, socket);

  // Send a welcome message to the client
  socket.write('Welcome to the server!\r\n');

  // Event handler for when data is received from the client
  socket.on('data', (data) => {
    console.log(`Received from client ${clientId}:`, data.toString());
  });

  // Event handler for when the client disconnects
  socket.on('end', () => {
    console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);

    // Remove the disconnected client from the map
    clientsMap.delete(clientId);
  });
});

// Set the server to listen on a specific port
const PORT = 9500;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Function to send a message to a specific client
function sendMessageToClient(clientId, message) {
  const clientSocket = clientsMap.get(clientId);

  if (clientSocket) {
    clientSocket.write(message);
  } else {
    console.log(`Client with ID ${clientId} not found.`);
  }
}

// Example: Send a message to a specific client every 10 seconds
setInterval(() => {
  const clientIdToSend = '127.0.0.1:60170'; // Replace with the desired client ID
  const messageToSend = 'Hello, specific client! This is a targeted message.';
  sendMessageToClient(clientIdToSend, messageToSend);
}, 10000);

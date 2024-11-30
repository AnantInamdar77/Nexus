const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store messages and users in memory (for simplicity)
const users = {}; // { socketId: username }
const groupMessages = []; // [{ user: 'user1', message: 'Hello Group!' }]

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins the chat with a username
  socket.on('join', (username) => {
    users[socket.id] = username;
    console.log(`${username} joined the chat.`);
    io.emit('user-list', Object.values(users));
  });

  // Handle one-to-one messaging
  socket.on('private-message', ({ to, message }) => {
    const sender = users[socket.id];
    const recipientSocket = Object.keys(users).find((id) => users[id] === to);
    if (recipientSocket) {
      io.to(recipientSocket).emit('private-message', { from: sender, message });
    }
  });

  // Handle group messages
  socket.on('group-message', (message) => {
    const sender = users[socket.id];
    groupMessages.push({ user: sender, message });
    io.emit('group-message', { user: sender, message });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    io.emit('user-list', Object.values(users));
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

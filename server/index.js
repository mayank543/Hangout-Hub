// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Allow CORS from frontend port (Vite default: 5173)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const onlineUsers = new Map(); // socketId -> user info

io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user-join', (user) => {
    onlineUsers.set(socket.id, user);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });

  // Handle sending messages
  socket.on('private-message', ({ toSocketId, message, fromUser }) => {
    io.to(toSocketId).emit('private-message', { message, fromUser });
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    onlineUsers.delete(socket.id);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Socket.IO Server is running');
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
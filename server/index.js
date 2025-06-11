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
    const userWithSocketId = {
      ...user,
      socketId: socket.id,
      joinedAt: user.joinedAt || Date.now(), // ✅ Ensure joinedAt is present
      mode: user.mode || 'Code', // ✅ Include mode with default
      // ✅ Include profile data if it exists
      project: user.project || '',
      website: user.website || '',
      status: user.status || '',
    };

    onlineUsers.set(socket.id, userWithSocketId);
    io.emit('online-users', Array.from(onlineUsers.values()));
    console.log(`✅ ${user.name} joined (${userWithSocketId.mode} mode) with profile data`);
  });

  // Handle sending messages
  socket.on("private-message", ({ toSocketId, message }) => {
    const fromUser = onlineUsers.get(socket.id); // get sender's real user object

    if (!fromUser) return;

    io.to(toSocketId).emit("receive-message", {
      message,
      fromUser, // real name, id, etc.
    });
  });

  // Handle focus time updates (preserve profile data)
  socket.on("update-focus-time", ({ dailyFocusTime, mode }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      user.dailyFocusTime = dailyFocusTime;
      if (mode) user.mode = mode;

      // ✅ Profile data (project, website, status) is preserved automatically
      onlineUsers.set(socket.id, user);
      io.emit("online-users", Array.from(onlineUsers.values()));
    }
  });

  // ✅ Handle immediate mode updates (preserve profile data)
  socket.on('update-mode', ({ mode }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      user.mode = mode;
      // ✅ Profile data is preserved automatically
      onlineUsers.set(socket.id, user);
      
      // Broadcast updated user list immediately
      io.emit('online-users', Array.from(onlineUsers.values()));
      console.log(`🎯 ${user.name} switched to ${mode} mode`);
    }
  });

  // Handle profile updates
  socket.on("update-user-profile", ({ userId, project, website, status }) => {
    const user = onlineUsers.get(socket.id);
    if (user && user.id === userId) {
      // ✅ Update profile fields
      user.project = project || '';
      user.website = website || '';
      user.status = status || '';
      
      onlineUsers.set(socket.id, user);
      io.emit("online-users", Array.from(onlineUsers.values()));
      console.log(`📁 ${user.name} updated profile: ${project ? `"${project}"` : 'No project'}`);
    }
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
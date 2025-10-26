// server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow CORS from frontend port (Vite default: 5173)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const onlineUsers = new Map(); // socketId -> user info
const userSocketMap = new Map(); // userId -> socketId (for message routing)

io.on("connection", (socket) => {
  console.log(` User connected: ${socket.id}`);

  // Handle user joining
  socket.on("user-join", (user) => {
    const userWithSocketId = {
      ...user,
      socketId: socket.id,
      joinedAt: user.joinedAt || Date.now(),
      mode: user.mode || "Code",
      project: user.project || "",
      website: user.website || "",
      status: user.status || "",
    };

    // Store user by socketId
    onlineUsers.set(socket.id, userWithSocketId);

    //  KEY FIX: Map userId to current socketId for message routing
    userSocketMap.set(user.id, socket.id);

    io.emit("online-users", Array.from(onlineUsers.values()));
    console.log(
      ` ${user.name} joined (${userWithSocketId.mode} mode) - userId: ${user.id} -> socketId: ${socket.id}`
    );
  });

  // 🔥 FIXED: Handle sending messages using userId instead of socketId
  socket.on("private-message", ({ toUserId, message }) => {
    const fromUser = onlineUsers.get(socket.id);

    if (!fromUser) {
      console.log("❌ Sender not found");
      return;
    }

    // Find the recipient's current socketId using their userId
    const toSocketId = userSocketMap.get(toUserId);

    if (!toSocketId) {
      console.log(`❌ Recipient userId ${toUserId} not found or offline`);
      return;
    }

    // Send message to the recipient's current socket
    io.to(toSocketId).emit("receive-message", {
      message,
      fromUser,
    });

    console.log(
      `💬 Message from ${fromUser.name} (${fromUser.id}) to userId ${toUserId} (socket: ${toSocketId})`
    );
  });

  // Handle focus time updates
  socket.on("update-focus-time", ({ dailyFocusTime, mode }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      user.dailyFocusTime = dailyFocusTime;
      if (mode) user.mode = mode;

      onlineUsers.set(socket.id, user);
      io.emit("online-users", Array.from(onlineUsers.values()));
    }
  });

  // Handle immediate mode updates
  socket.on("update-mode", ({ mode }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      user.mode = mode;
      onlineUsers.set(socket.id, user);

      io.emit("online-users", Array.from(onlineUsers.values()));
      console.log(`🎯 ${user.name} switched to ${mode} mode`);
    }
  });

  // Handle profile updates
  socket.on("update-user-profile", ({ userId, project, website, status }) => {
    const user = onlineUsers.get(socket.id);
    if (user && user.id === userId) {
      user.project = project || "";
      user.website = website || "";
      user.status = status || "";

      onlineUsers.set(socket.id, user);
      io.emit("online-users", Array.from(onlineUsers.values()));
      console.log(
        `📁 ${user.name} updated profile: ${
          project ? `"${project}"` : "No project"
        }`
      );
    }
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);

    if (user) {
      console.log(
        `🔴 User ${user.name} (${user.id}) disconnected: ${socket.id}`
      );
      // Remove from both maps
      userSocketMap.delete(user.id);
    } else {
      console.log(`🔴 Unknown user disconnected: ${socket.id}`);
    }

    onlineUsers.delete(socket.id);
    io.emit("online-users", Array.from(onlineUsers.values()));
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Socket.IO Server is running");
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

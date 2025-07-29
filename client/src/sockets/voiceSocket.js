// // socket/voiceSocket.js - Debug Version
// import { io } from "socket.io-client";

// const debugLog = (message) => {
//   const timestamp = new Date().toLocaleTimeString();
//   console.log(`[VOICE SOCKET ${timestamp}] ${message}`);
// };

// const voiceSocket = io(import.meta.env.VITE_BACKEND_URL, {
//   autoConnect: false,
//   transports: ["websocket"],
//   timeout: 20000,
//   forceNew: true
// });

// export const connectVoiceSocket = (userId, roomId) => {
//   debugLog(`🔄 Attempting to connect - userId: ${userId}, roomId: ${roomId}`);
//   debugLog(`📡 Backend URL: ${import.meta.env.VITE_BACKEND_URL}`);
//   debugLog(`🔗 Socket connected before connect: ${voiceSocket.connected}`);
  
//   if (!voiceSocket.connected) {
//     debugLog("🔌 Connecting voice socket...");
//     voiceSocket.connect();
//   }
  
//   // Wait a bit for connection to establish
//   setTimeout(() => {
//     debugLog(`🔗 Socket connected after timeout: ${voiceSocket.connected}`);
//     if (voiceSocket.connected) {
//       debugLog(`📤 Emitting join-voice-room for userId: ${userId}, roomId: ${roomId}`);
//       voiceSocket.emit("join-voice-room", { userId, roomId });
//     } else {
//       debugLog("❌ Socket not connected, cannot join room");
//     }
//   }, 1000);
// };

// export const leaveVoiceRoom = (roomId) => {
//   debugLog(`🚪 Leaving voice room: ${roomId}`);
//   if (voiceSocket.connected) {
//     voiceSocket.emit("leave-voice-room", { roomId });
//   } else {
//     debugLog("❌ Socket not connected, cannot leave room");
//   }
// };

// // Enhanced connection status logging
// voiceSocket.on("connect", () => {
//   debugLog("✅ Voice socket connected successfully");
// });

// voiceSocket.on("disconnect", (reason) => {
//   debugLog(`❌ Voice socket disconnected: ${reason}`);
// });

// voiceSocket.on("connect_error", (error) => {
//   debugLog(`❌ Voice socket connection error: ${error.message}`);
// });

// voiceSocket.on("reconnect", (attemptNumber) => {
//   debugLog(`🔄 Voice socket reconnected after ${attemptNumber} attempts`);
// });

// voiceSocket.on("reconnect_error", (error) => {
//   debugLog(`❌ Voice socket reconnection error: ${error.message}`);
// });

// // Debug all incoming events
// const originalOn = voiceSocket.on;
// voiceSocket.on = function(event, callback) {
//   return originalOn.call(this, event, function(...args) {
//     debugLog(`📥 Received event: ${event} with data: ${JSON.stringify(args)}`);
//     return callback(...args);
//   });
// };

// // Debug all outgoing events
// const originalEmit = voiceSocket.emit;
// voiceSocket.emit = function(event, ...args) {
//   debugLog(`📤 Emitting event: ${event} with data: ${JSON.stringify(args)}`);
//   return originalEmit.call(this, event, ...args);
// };

// export default voiceSocket;
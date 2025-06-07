// client/src/socket/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false, // we'll connect manually after auth
   transports: ['websocket'],  // ⬅ Force only WebSocket transport
  withCredentials: true, 
});

export const connectSocket = (user) => {
  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("user-join", user);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("❌ Disconnected from server");
  }
};
export { socket };
export default socket;
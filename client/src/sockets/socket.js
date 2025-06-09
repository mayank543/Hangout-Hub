import { io } from "socket.io-client";
import useClockStore from '../store/useClockStore';
import useAppStore from '../store/useAppStore'; // ✅ Add this here

const socket = io("http://localhost:3001", {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true, 
});

export const connectSocket = (user) => {
  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      console.log("✅ Connected:", socket.id);

      const userWithSocket = {
  ...user,
  socketId: socket.id,
  joinedAt: Date.now(), // ✅ Add this
};


      socket.emit("user-join", userWithSocket);
      startSendingFocusTime();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    // ✅ Listen for updated online user list from server
    socket.on("online-users", (users) => {
      console.log("📡 Received updated users:", users);
      useAppStore.getState().setOnlineUsers(users); // ✅ Update Zustand
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.off("online-users"); // 🧼 Clean up
    socket.disconnect();
    console.log("❌ Disconnected from server");
  }
};

let intervalId = null;

export const startSendingFocusTime = () => {
  if (intervalId) return;

  intervalId = setInterval(() => {
    const dailyFocusTime = useClockStore.getState().dailyFocusTime;
    socket.emit('update-focus-time', { dailyFocusTime });
  }, 30000);
};

export { socket };
export default socket;
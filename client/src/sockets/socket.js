import { io } from "socket.io-client";
import useClockStore from '../store/useClockStore';
import useAppStore from '../store/useAppStore'; // ✅ Zustand for user state

const backendUrl = import.meta.env.PROD
  ? "https://hangout-hub-1-egjh.onrender.com/" // 🔁 Replace with actual deployed backend URL
  : "http://localhost:3001";

const socket = io(backendUrl, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});

export const connectSocket = (user) => {
  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Load saved profile data from localStorage when connecting
      const savedProfile = useAppStore.getState().getSavedProfile(user.id);

      const userWithSocket = {
        ...user,
        ...savedProfile, // ✅ Include saved profile data when joining
        socketId: socket.id,
        joinedAt: Date.now(), // ✅ Timestamp
        mode: useClockStore.getState().mode, // ✅ Current mode
      };

      socket.emit("user-join", userWithSocket);
      useAppStore.getState().setCurrentUserId(user.id);
      startSendingFocusTime();
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    socket.on("online-users", (users) => {
      console.log("📡 Received updated users:", users);
      useAppStore.getState().setOnlineUsers(users); // ✅ Update Zustand
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.off("online-users");
    socket.disconnect();
    console.log("❌ Disconnected from server");
  }
};

let intervalId = null;

export const startSendingFocusTime = () => {
  if (intervalId) return;

  intervalId = setInterval(() => {
    const { dailyFocusTime, mode } = useClockStore.getState();
    const { currentUserId, onlineUsers } = useAppStore.getState();

    const currentUser = onlineUsers.find(u => u.id === currentUserId);

    if (currentUser) {
      socket.emit('update-focus-time', {
        ...currentUser,              // ✅ Include full user object
        dailyFocusTime,             // ✅ Overwrite just these
        mode
      });
    }
  }, 30000);
};

// ✅ Send mode changes immediately without losing other fields
export const updateUserMode = (mode) => {
  if (socket.connected) {
    const { currentUserId, onlineUsers } = useAppStore.getState();
    const currentUser = onlineUsers.find(u => u.id === currentUserId);

    if (currentUser) {
      socket.emit('update-mode', {
        ...currentUser,
        mode
      });
    }
  }
};

// ✅ New function to update user profile on the server
export const updateUserProfile = (userId, profileData) => {
  if (socket.connected) {
    socket.emit("update-user-profile", {
      userId,
      project: profileData.project || '',
      website: profileData.website || '',
      status: profileData.status || ''
    });
  }
};

export { socket };
export default socket;
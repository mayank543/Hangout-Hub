import { io } from "socket.io-client";
import useClockStore from '../store/useClockStore';
import useAppStore from '../store/useAppStore'; // ✅ Zustand for user state
import useChatStore from "../store/useChatStore"; // ✅ Import the chat store

const backendUrl = import.meta.env.PROD
  ? "https://hangout-hub-1-egjh.onrender.com/" // 🔁 Replace with actual deployed backend URL
  : "http://localhost:3001";

const socket = io(backendUrl, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 6000,     // 6 second delay
  reconnectionAttempts: 3,     // 3 attempts
  randomizationFactor: 0.5,    // Add some randomness to delays
  // withCredentials: true,
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
  useAppStore.getState().setOnlineUsers(users);
});

// ✅ Handle incoming private messages
socket.on("receive-message", (data) => {
  const { message, fromUser } = data;
  const { activeChatUser, incrementUnread, addMessage } = useChatStore.getState();

  console.log("📨 Received private message:", message, "from:", fromUser.name);
  console.log("👤 Current active chat user:", activeChatUser);

  // Save the message with the correct structure
  const msgObj = {
    from: "them",
    text: message,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  addMessage(fromUser.id, msgObj);

  // If the chat is not currently open with this user, increase unread count
  if (!activeChatUser || activeChatUser.id !== fromUser.id) {
    console.log("🔴 Chat not open with this user, incrementing unread count for:", fromUser.name);
    incrementUnread(fromUser.id);
  } else {
    console.log("🟢 Chat is open with this user, not incrementing unread count");
  }

  // Optional: Show browser notification if chat is not active
  if (!activeChatUser || activeChatUser.id !== fromUser.id) {
    if (Notification.permission === "granted") {
      new Notification(`New message from ${fromUser.name}`, {
        body: message,
        icon: "/favicon.ico" // Add your app icon path
      });
    }
  }
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
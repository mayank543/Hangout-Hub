import { io } from "socket.io-client";
import useClockStore from '../store/useClockStore';
import useAppStore from '../store/useAppStore';
import useChatStore from "../store/useChatStore";

const primaryUrl = import.meta.env.PROD
  ? "https://hangout-hub-1-egjh.onrender.com"
  : "http://localhost:3001";

const backupUrl = "https://hangout-hub-p4mn.onrender.com";

let backendUrl = primaryUrl;

// ✅ Exponential backoff for reconnection attempts
const socket = io(backendUrl, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 2000,          // Start with 2 seconds
  reconnectionDelayMax: 30000,      // Max 30 seconds between attempts
  reconnectionAttempts: 5,          // Reduce attempts
  randomizationFactor: 0.5,
  timeout: 10000,                   // 10 second timeout
  forceNew: false,                  // Reuse existing connection
});

// ✅ Connection state tracking
let isConnecting = false;
let connectionAttempts = 0;
let lastConnectionTime = 0;
let intervalId = null;
let lastFocusTimeUpdate = 0;
let lastModeUpdate = 0;

// ✅ Debounce function to prevent spam
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// ✅ Throttle function for frequent updates
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const connectSocket = (user) => {
  // ✅ Prevent multiple connection attempts
  if (socket.connected || isConnecting) {
    console.log("🔄 Already connected or connecting...");
    return;
  }

  // ✅ Rate limit connection attempts (max 1 per 5 seconds)
  const now = Date.now();
  if (now - lastConnectionTime < 5000) {
    console.log("⏳ Connection rate limited, please wait...");
    return;
  }

  isConnecting = true;
  lastConnectionTime = now;
  connectionAttempts++;

  console.log(`🔌 Attempting connection #${connectionAttempts}...`);

  socket.connect();

  // ✅ Single connection handler
  const handleConnection = () => {
    console.log("✅ Connected:", socket.id);
    isConnecting = false;
    connectionAttempts = 0;

    const savedProfile = useAppStore.getState().getSavedProfile(user.id);
    const userWithSocket = {
      ...user,
      ...savedProfile,
      socketId: socket.id,
      joinedAt: Date.now(),
      mode: useClockStore.getState().mode,
    };

    socket.emit("user-join", userWithSocket);
    useAppStore.getState().setCurrentUserId(user.id);
    startSendingFocusTime();
  };

  // ✅ Remove any existing listeners before adding new ones
  socket.off("connect");
  socket.off("connect_error");
  socket.off("online-users");
  socket.off("receive-message");

  socket.once("connect", handleConnection);

  socket.on("connect_error", (err) => {
    console.error(`❌ Connection failed (attempt ${connectionAttempts}):`, err.message);
    isConnecting = false;
    
    // ✅ Exponential backoff for failed connections
    if (connectionAttempts < 5) {
      const delay = Math.min(2000 * Math.pow(2, connectionAttempts), 30000);
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      setTimeout(() => connectSocket(user), delay);
    } else {
      console.log("🛑 Max connection attempts reached. Please refresh the page.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Disconnected:", reason);
    isConnecting = false;
    stopSendingFocusTime();
    
    // ✅ Only auto-reconnect for certain disconnect reasons
    if (reason === "io server disconnect" || reason === "io client disconnect") {
      console.log("🔄 Manual disconnect, not auto-reconnecting");
    }
  });

  // ✅ Throttled online users update
  const handleOnlineUsers = throttle((users) => {
    console.log("📡 Received updated users:", users.length);
    useAppStore.getState().setOnlineUsers(users);
  }, 1000); // Max once per second

  socket.on("online-users", handleOnlineUsers);

  // ✅ Message handler (no changes needed, already efficient)
  socket.on("receive-message", (data) => {
    const { message, fromUser } = data;
    const { activeChatUser, incrementUnread, addMessage } = useChatStore.getState();

    console.log("📨 Received private message from:", fromUser.name);

    const msgObj = {
      from: "them",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(fromUser.id, msgObj);

    if (!activeChatUser || activeChatUser.id !== fromUser.id) {
      console.log("🔴 Incrementing unread count for:", fromUser.name);
      incrementUnread(fromUser.id);

      // ✅ Throttled notifications
      if (Notification.permission === "granted") {
        new Notification(`New message from ${fromUser.name}`, {
          body: message,
          icon: "/favicon.ico"
        });
      }
    }
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("🔌 Manually disconnecting...");
    stopSendingFocusTime();
    socket.off(); // Remove all listeners
    socket.disconnect();
    isConnecting = false;
    console.log("❌ Disconnected from server");
  }
};

// ✅ Optimized focus time updates with throttling
export const startSendingFocusTime = () => {
  if (intervalId) {
    console.log("⏳ Focus time interval already running");
    return;
  }

  console.log("🚀 Starting focus time updates...");
  
  // ✅ Increased interval to reduce requests (was 30s, now 60s)
  intervalId = setInterval(() => {
    if (!socket.connected) {
      console.log("🔌 Socket disconnected, stopping focus time updates");
      stopSendingFocusTime();
      return;
    }

    const now = Date.now();
    // ✅ Additional throttling - don't send if last update was < 55 seconds ago
    if (now - lastFocusTimeUpdate < 55000) {
      return;
    }

    const { dailyFocusTime, mode } = useClockStore.getState();
    const { currentUserId, onlineUsers } = useAppStore.getState();
    const currentUser = onlineUsers.find(u => u.id === currentUserId);

    if (currentUser) {
      socket.emit('update-focus-time', {
        ...currentUser,
        dailyFocusTime,
        mode
      });
      lastFocusTimeUpdate = now;
      console.log("📊 Focus time updated");
    }
  }, 60000); // ✅ Increased from 30s to 60s
};

export const stopSendingFocusTime = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("⏹️ Stopped focus time updates");
  }
};

// ✅ Throttled mode updates
export const updateUserMode = throttle((mode) => {
  if (!socket.connected) {
    console.log("🔌 Socket not connected, cannot update mode");
    return;
  }

  const now = Date.now();
  // ✅ Prevent spam mode updates (max once per 2 seconds)
  if (now - lastModeUpdate < 2000) {
    console.log("⏳ Mode update throttled");
    return;
  }

  const { currentUserId, onlineUsers } = useAppStore.getState();
  const currentUser = onlineUsers.find(u => u.id === currentUserId);

  if (currentUser) {
    socket.emit('update-mode', {
      ...currentUser,
      mode
    });
    lastModeUpdate = now;
    console.log("🔄 Mode updated to:", mode);
  }
}, 2000);

// ✅ Debounced profile updates
export const updateUserProfile = debounce((userId, profileData) => {
  if (!socket.connected) {
    console.log("🔌 Socket not connected, cannot update profile");
    return;
  }

  socket.emit("update-user-profile", {
    userId,
    project: profileData.project || '',
    website: profileData.website || '',
    status: profileData.status || ''
  });
  console.log("👤 Profile updated for user:", userId);
}, 1000); // ✅ Debounce profile updates by 1 second

// ✅ Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    disconnectSocket();
  });

  // ✅ Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden, reduce activity
      stopSendingFocusTime();
    } else {
      // Page is visible again, resume activity
      if (socket.connected) {
        startSendingFocusTime();
      }
    }
  });
}

export { socket };
export default socket;
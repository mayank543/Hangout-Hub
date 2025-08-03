import { useEffect, useState, useRef } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import LofiPlayer from "./components/LofiPlayer";
import Navbar from "./components/Navbar";
import FocusClock from "./components/FocusClock";
import { connectSocket, disconnectSocket, socket } from "./sockets/socket";
import OnlineUsers from "./components/OnlineUsers";
import useAppStore from "./store/useAppStore";
import useClockStore from "./store/useClockStore";
import ChatBox from "./components/ChatBox";
import CalendarToggleButton from "./components/CalendarToggleButton";
import TodoList from "./components/TodoList";
import ProfileEditorModal from "./components/ProfileEditorModal";
import TodoToggleButton from "./components/TodoToggleButton";
import SignInContainer from "./components/SignInContainer";

function App() {
  const { user, isSignedIn } = useUser();
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);
  const setOnlineUsers = useAppStore((state) => state.setOnlineUsers);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const mode = useClockStore((state) => state.mode);

  const [showTodo, setShowTodo] = useState(false);
  
  // 🔥 Track connection state to prevent duplicates
  const isConnectedRef = useRef(false);
  const lastUserIdRef = useRef(null);

  useEffect(() => {
    const isGuest = currentUserId?.startsWith("guest-");
    
    // 🔥 PREVENT UNNECESSARY CONNECTIONS: Only connect if we have proper user data
    const shouldConnect = (isSignedIn && user?.id && user?.fullName) || (isGuest && currentUserId);
    
    if (!shouldConnect) {
      console.log("⏭️ Skipping connection - missing user data");
      return;
    }

    // 🔥 PREVENT DUPLICATE CONNECTIONS: Check if already connected with same user
    if (isConnectedRef.current && lastUserIdRef.current === (user?.id || currentUserId)) {
      console.log("⏭️ Already connected with same user, skipping...");
      return;
    }

    // 🔥 PREVENT SOCKET SPAM: Check if socket is already connected
    if (socket.connected && lastUserIdRef.current === (user?.id || currentUserId)) {
      console.log("⏭️ Socket already connected, skipping...");
      return;
    }

    const guestName = localStorage.getItem("guestName");
    const guestAvatar = localStorage.getItem("guestAvatar");

    const userData = isSignedIn && user
      ? {
          id: user.id,
          name: user.fullName,
          avatar: user.imageUrl,
          room: "Focus void",
          project: "",
          website: "", 
          status: "",
          mode: mode || "Chill",
          dailyFocusTime: 0,
          streak: 1,
          lockedInTime: "0m",
        }
      : isGuest
      ? {
          id: currentUserId,
          name: guestName || "Guest",
          avatar: guestAvatar || `https://api.dicebear.com/8.x/identicon/svg?seed=${currentUserId}`,
          room: "Focus void",
          project: "Guest Session",
          website: "",
          status: "Exploring as guest",
          mode: mode || "Chill", 
          dailyFocusTime: 0,
          streak: 1,
          lockedInTime: "0m",
        }
      : null;

    if (userData) {
      console.log("🔌 Connecting user to socket:", userData.name, userData.id);
      
      // 🔥 CLEAN UP EXISTING LISTENERS first
      socket.off("online-users");
      
      // Connect to socket
      connectSocket(userData);
      
      // 🔥 ADD LISTENER ONLY ONCE per connection
      const handleOnlineUsers = (users) => {
        console.log("📡 Received online users:", users.length);
        setOnlineUsers(users);
      };

      socket.on("online-users", handleOnlineUsers);
      
      // Track connection state
      isConnectedRef.current = true;
      lastUserIdRef.current = userData.id;

      // 🔥 CLEANUP FUNCTION with proper listener removal
      return () => {
        console.log("🧹 Cleaning up socket connection");
        socket.off("online-users", handleOnlineUsers);
        isConnectedRef.current = false;
        lastUserIdRef.current = null;
      };
    }
  }, [
    isSignedIn, 
    user?.id,           // 🔥 Only track specific user properties
    user?.fullName,     // 🔥 that won't change frequently
    user?.imageUrl, 
    currentUserId, 
    setOnlineUsers
  ]); // 🔥 Removed 'mode' from dependencies to prevent excess re-renders

  // 🔥 SEPARATE useEffect for cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🔌 Component unmounting, disconnecting socket");
      disconnectSocket();
    };
  }, []);

  const isGuest = currentUserId?.startsWith("guest-");
  const isLoggedIn = isSignedIn || isGuest;

  const handleGuestLogout = () => {
    localStorage.removeItem("guestName");
    localStorage.removeItem("guestAvatar");
    useAppStore.getState().setCurrentUserId(null);
    isConnectedRef.current = false;
    lastUserIdRef.current = null;
    disconnectSocket();
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <LofiPlayer />
      <Navbar />
      <ProfileEditorModal />
      {showOnlineUsers && <OnlineUsers />}
      <ChatBox />

      {isLoggedIn ? (
        <>
          {/* Focus Timer */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <FocusClock />
          </div>

          {/* Calendar and Todo Buttons */}
          <div className="absolute bottom-3 left-21 flex gap- z-30">
            <CalendarToggleButton />
            <TodoToggleButton
              onClick={() => setShowTodo((prev) => !prev)}
              isOpen={showTodo}
            />
          </div>

          {/* Show To-Do UI */}
          {showTodo && <TodoList onClose={() => setShowTodo(false)} />}

          {/* User Button or Guest Logout */}
          <div className="absolute top-4 right-4 z-10">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <button
                onClick={handleGuestLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                logout guest
              </button>
            )}
          </div>
        </>
      ) : (
        <SignInContainer />
      )}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
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
import useClockStore from "./store/useClockStore"; // Import clock store
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
  const mode = useClockStore((state) => state.mode); // Get mode from clock store

  const [showTodo, setShowTodo] = useState(false);

  useEffect(() => {
    const isGuest = currentUserId?.startsWith("guest-");

    const guestName = localStorage.getItem("guestName");
    const guestAvatar = localStorage.getItem("guestAvatar");

    // Create complete user data with all required fields
    const userData = isSignedIn && user
      ? {
          id: user.id,
          name: user.fullName,
          avatar: user.imageUrl,
          room: "Focus void",
          // Add required fields for OnlineUsers component
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
          // Add required fields for OnlineUsers component
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
      console.log("🔌 Connecting user to socket:", userData);
      connectSocket(userData);

      // Listen for online users updates
      socket.on("online-users", (users) => {
        console.log("📡 Received online users:", users);
        setOnlineUsers(users);
      });
    }

    return () => {
      disconnectSocket();
      socket.off("online-users");
    };
  }, [isSignedIn, user, currentUserId, mode, setOnlineUsers]);

  const isGuest = currentUserId?.startsWith("guest-");
  const isLoggedIn = isSignedIn || isGuest;

  const handleGuestLogout = () => {
    localStorage.removeItem("guestName");
    localStorage.removeItem("guestAvatar");
    useAppStore.getState().setCurrentUserId(null);
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

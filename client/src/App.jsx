import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import LofiPlayer from "./components/LofiPlayer";
import Navbar from "./components/Navbar";
import TimerPanel from "./components/TimerPanel";
import { connectSocket, disconnectSocket, socket } from "./sockets/socket"; // 🔁 import socket
import OnlineUsers from "./components/OnlineUsers";
import useAppStore from "./store/useAppStore";

function App() {
  const { user, isSignedIn } = useUser();
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);
  const setOnlineUsers = useAppStore((state) => state.setOnlineUsers); // ✅ grab Zustand setter

  useEffect(() => {
    if (isSignedIn && user) {
      connectSocket({
        id: user.id,
        name: user.fullName,
        avatar: user.imageUrl,
        room: "Focus void",
      });

      // ✅ Listen for "online-users" and update Zustand
      socket.on("online-users", (users) => {
        setOnlineUsers(users);
      });
    }

    return () => {
      disconnectSocket();
      socket.off("online-users"); // ✅ clean up
    };
  }, [isSignedIn, user, setOnlineUsers]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <LofiPlayer />
      <Navbar />
      {showOnlineUsers && <OnlineUsers />}

      <SignedIn>
        <TimerPanel />
        <div className="absolute top-4 right-4 z-10">
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/70 text-white">
          <p className="mb-4 text-lg">Please sign in to use the timer</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}

export default App;
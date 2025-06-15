import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import LofiPlayer from "./components/LofiPlayer";
import Navbar from "./components/Navbar";
import FocusClock from "./components/FocusClock";
import { connectSocket, disconnectSocket, socket } from "./sockets/socket";
import OnlineUsers from "./components/OnlineUsers";
import useAppStore from "./store/useAppStore";
import ChatBox from "./components/ChatBox";
import CalendarToggleButton from "./components/CalendarToggleButton";
import TodoList from "./components/TodoList";
import ProfileEditorModal from "./components/ProfileEditorModal";
import TodoToggleButton from "./components/TodoToggleButton";


function App() {
  const { user, isSignedIn } = useUser();
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);
  const setOnlineUsers = useAppStore((state) => state.setOnlineUsers);

  const [showTodo, setShowTodo] = useState(false); // 📝 To-do toggle state

  useEffect(() => {
    if (isSignedIn && user) {
      connectSocket({
        id: user.id,
        name: user.fullName,
        avatar: user.imageUrl,
        room: "Focus void",
      });

      socket.on("online-users", (users) => {
        setOnlineUsers(users);
      });
    }

    return () => {
      disconnectSocket();
      socket.off("online-users");
    };
  }, [isSignedIn, user, setOnlineUsers]);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <LofiPlayer />
      <Navbar />
      <ProfileEditorModal />
      {showOnlineUsers && <OnlineUsers />}
      <ChatBox />

      <SignedIn>
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

        {/* User Button */}
        <div className="absolute top-4 right-4 z-10">
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/70 text-white">
          <p className="mb-4 text-lg">Please sign in to use the timer(Its Worth it Plz Try).</p>
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
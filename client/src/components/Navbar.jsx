import { FaPlus, FaExpand } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPower } from "react-icons/bs";
import { HiOutlineMusicalNote, HiOutlineHome, HiOutlineUsers } from "react-icons/hi2";
import useAppStore from "../store/useAppStore";
import useAudioStore from "../store/useAudioStore"; // ✅ NEW
import { UserButton, SignedIn } from "@clerk/clerk-react";

export default function Navbar() {
  const {
    currentRoom,
    onlineUsers,
    lockedDays,
    toggleOnlineUsers,
  } = useAppStore();

  const {
    isPlaying,
    setIsPlaying,
  } = useAudioStore(); // ✅ FROM useAudioStore.js

  return (
    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-black/30 backdrop-blur-md text-white fixed top-0 z-50 border-b border-white/10">
      {/* Left Button */}
      <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-sm">
        <FaPlus className="text-xs" />
        <span>Add Freedom Project</span>
      </button>

      {/* Center: Days Locked In */}
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-sm">
        <BsPower className="text-orange-400 text-sm" />
        <span>Days Locked In:</span>
        <span className="font-semibold">{lockedDays}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Expand Icon */}
        <button className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200">
          <FaExpand className="text-sm" />
        </button>

        {/* Music */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border backdrop-blur-sm transition-all duration-200 text-sm ${
            isPlaying 
              ? "bg-blue-500/30 border-blue-400/50 hover:bg-blue-500/40" 
              : "bg-white/10 border-white/20 hover:bg-white/20"
          }`}
        >
          <HiOutlineMusicalNote className="text-base" />
          <IoMdArrowDropdown className="text-sm" />
        </button>

        {/* Room Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/30 backdrop-blur-sm border border-green-400/50 hover:bg-green-500/40 hover:border-green-400/60 cursor-pointer transition-all duration-200 text-sm">
          <HiOutlineHome className="text-base" />
          <span>{currentRoom}</span>
          <IoMdArrowDropdown className="text-sm" />
        </div>

        {/* Online Users */}
        <button
          onClick={toggleOnlineUsers}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-sm"
        >
          <HiOutlineUsers className="text-base" />
          <span>{Array.isArray(onlineUsers) ? onlineUsers.length : onlineUsers} online</span>
        </button>

        {/* Clerk User Profile */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
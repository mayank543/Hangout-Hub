import { FaPlus, FaExpand } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPower } from "react-icons/bs";
import { HiOutlineMusicalNote, HiOutlineHome, HiOutlineUsers } from "react-icons/hi2";
import useAppStore from "../store/useAppStore";
import useAudioStore from "../store/useAudioStore";
import { UserButton, SignedIn } from "@clerk/clerk-react";
import { HiOutlinePhoto } from "react-icons/hi2"; 
import MusicToggle from "./MusicToggle";
import useChatStore from "../store/useChatStore";

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
  } = useAudioStore();

  const { unreadCounts } = useChatStore();
  // Calculate total unread messages across all users
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  const { toggleProfileEditor } = useAppStore();
  const { nextBackground } = useAppStore();

  return (
    <div className="flex items-center justify-between w-full px-2 sm:px-4 py-2 sm:py-2.5 bg-black/30 backdrop-blur-md text-white fixed top-0 z-50 border-b border-white/10">
      {/* Left Button */}
      <button
        onClick={toggleProfileEditor}
        className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-xs sm:text-sm"
      >
        <FaPlus className="text-xs flex-shrink-0" />
        <span className="hidden sm:inline">Edit Online Presence</span>
        <span className="sm:hidden">Add</span>
      </button>

      {/* Center - Change BG Button */}
      <button
        onClick={nextBackground}
        className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 hover:bg-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-xs sm:text-sm"
      >
        <HiOutlinePhoto className="text-sm sm:text-base" />
        <span className="hidden sm:inline">Change BG</span>
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Expand Icon - Hidden on mobile */}
        {/* <button className="hidden sm:flex p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200">
          <FaExpand className="text-sm" />
        </button> */}

        {/* Music */}
        {/* <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm ${
            isPlaying 
              ? "bg-blue-500/30 border-blue-400/50 hover:bg-blue-500/40" 
              : "bg-white/10 border-white/20 hover:bg-white/20"
          }`}
        >
          <HiOutlineMusicalNote className="text-sm sm:text-base flex-shrink-0" />
          <IoMdArrowDropdown className="text-xs sm:text-sm hidden sm:inline" />
        </button> */}
        <MusicToggle />  

        {/* Room Dropdown */}
        {/* <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-green-500/30 backdrop-blur-sm border border-green-400/50 hover:bg-green-500/40 hover:border-green-400/60 cursor-pointer transition-all duration-200 text-xs sm:text-sm">
          <HiOutlineHome className="text-sm sm:text-base flex-shrink-0" />
          <span className="max-w-16 sm:max-w-none truncate">{currentRoom}</span>
          <IoMdArrowDropdown className="text-xs sm:text-sm hidden sm:inline" />
        </div> */}

        {/* Online Users with Notification Badge */}
        <div className="relative">
          <button
            onClick={toggleOnlineUsers}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 text-xs sm:text-sm"
          >
            <HiOutlineUsers className="text-sm sm:text-base flex-shrink-0" />
            <span className="hidden sm:inline">{Array.isArray(onlineUsers) ? onlineUsers.length : onlineUsers} online</span>
            <span className="sm:hidden">{Array.isArray(onlineUsers) ? onlineUsers.length : onlineUsers}</span>
          </button>

          {/* Notification badge for unread messages */}
           {totalUnread > 0 && (
            <div className="absolute -top-0.5 -right-0.5 bg-blue-400/90 backdrop-blur-sm text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white/30">
              {totalUnread > 9 ? '9+' : totalUnread}
            </div>
          )}
        </div>

        {/* Clerk User Profile */}
        <SignedIn>
          <div className="scale-75 sm:scale-100">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
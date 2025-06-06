import { FaPlus, FaMusic, FaUsers, FaExpand } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPower } from "react-icons/bs";
import useAppStore from "../store/useAppStore";
import { UserButton, SignedIn } from "@clerk/clerk-react";

export default function Navbar() {
  const {
    isMusicPlaying,
    toggleMusic,
    currentRoom,
    onlineUsers,
    lockedDays,
  } = useAppStore();

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-black/60 backdrop-blur-md text-white fixed top-0 z-50">
      {/* Left Button */}
      <button className="flex items-center gap-2 bg-[#0e1e2b] px-4 py-2 rounded border border-white/20 hover:bg-[#172f44] transition">
        <FaPlus />
        <span>Add Freedom Project</span>
      </button>

      {/* Center: Days Locked In */}
      <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-white/20">
        <BsPower className="text-orange-400" />
        <span>Days Locked In:</span>
        <span className="font-semibold">{lockedDays}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Expand Icon */}
        <button className="p-2 rounded bg-white/10 border border-white/10 hover:bg-white/20">
          <FaExpand />
        </button>

        {/* Music */}
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-1 px-3 py-2 rounded border ${
            isMusicPlaying ? "bg-white/10" : "bg-white/5"
          } hover:bg-white/20`}
        >
          <FaMusic />
          <IoMdArrowDropdown />
        </button>

        {/* Room Dropdown */}
        <div className="flex items-center gap-1 px-3 py-2 rounded bg-green-700 border border-green-400 hover:bg-green-800 cursor-pointer">
          <span>{currentRoom}</span>
          <IoMdArrowDropdown />
        </div>

        {/* Online Users */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded border border-white/10">
          <FaUsers />
          <span>{onlineUsers} online</span>
        </div>

       {/* Clerk User Profile */}
<SignedIn>
  <UserButton />
</SignedIn>
      </div>
    </div>
  );
}
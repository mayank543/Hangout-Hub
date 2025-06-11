import React, { useState } from "react";
import { FaPlay, FaPause, FaCheck } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import useClockStore from "../store/useClockStore";
import { socket } from "../sockets/socket";// ✅ Import the socket function
import { updateUserMode } from '../sockets/socket';

const pad = (n) => String(n).padStart(2, "0");

export default function FocusClock() {
  const {
    time,
    isRunning,
    isPomodoro,
    mode,
    toggleRunning,
    togglePomodoro,
    setDone,
    setMode,
  } = useClockStore();

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const visibleModes = ["Code", "Market", "Design"];
  const extraModes = ["DSA", "School", "Chill"];
  
  // Check if current mode is in extra modes
  const isExtraMode = extraModes.includes(mode);
  
  // If current mode is extra, replace the last visible mode with it
  const displayModes = isExtraMode 
    ? [...visibleModes.slice(0, 2), mode]
    : visibleModes;

  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Enhanced setMode function that also updates socket
  const handleModeChange = (newMode) => {
    setMode(newMode);
    updateUserMode(newMode); // ✅ Notify other users about mode change
  };

  return (
    <div className="bg-black/15 backdrop-blur-xl border border-white/10 text-white p-4 rounded-3xl shadow-2xl w-[500px] mx-auto flex flex-col items-center">
      <p className="text-sm font-medium mb-3 opacity-80">Ready to lock in?</p>

      {/* Timer and buttons */}
      <div className="flex items-center gap-8 mb-4">
        <div className="text-3xl font-mono tracking-widest">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={toggleRunning}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition ${
              isRunning
                ? "bg-red-500/20 hover:bg-red-500/30"
                : "bg-green-500/20 hover:bg-green-500/30"
            }`}
          >
            {isRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>

          <button
            onClick={setDone}
            className="w-10 h-10 rounded-full bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center transition"
          >
            <FaCheck size={14} />
          </button>

          <button
            onClick={togglePomodoro}
            className={`w-14 h-10 rounded-full flex items-center justify-between px-2 transition backdrop-blur-md border border-white/20 ${
              isPomodoro
                ? "bg-pink-500/20 hover:bg-pink-500/30"
                : "bg-gray-500/20 hover:bg-gray-500/30"
            }`}
          >
            <MdOutlineTimer size={16} />
            <div className="w-3 h-3 bg-white/80 rounded-full" />
          </button>
        </div>
      </div>

      {/* Mode Tabs and Dropdown */}
      <div className="flex gap-3 w-full justify-center relative">
        {displayModes.map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)} // ✅ Use enhanced function
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-md border border-white/10 ${
              mode === m
                ? "bg-blue-500/30 text-white border-blue-400/30"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {m === "Code" && <span>💻</span>}
            {m === "Market" && <span>📣</span>}
            {m === "Design" && <span>🎨</span>}
            {m === "DSA" && <span>📚</span>}
            {m === "School" && <span>🏫</span>}
            {m === "Chill" && <span>😌</span>}
            {m}
          </button>
        ))}

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
          >
            <span className="text-[10px]">⋯</span>
          </button>

          {showDropdown && (
            <div className="absolute bottom-full mb-2 right-0 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-2 min-w-[120px]">
              {/* Show all modes that aren't currently displayed */}
              {[...visibleModes, ...extraModes]
                .filter(m => !displayModes.includes(m))
                .map((m, index, filteredArray) => (
                <button
                  key={m}
                  onClick={() => {
                    handleModeChange(m); // ✅ Use enhanced function
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm transition ${
                    mode === m
                      ? "bg-blue-500/30 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredArray.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  {m === "Code" && <span>💻</span>}
                  {m === "Market" && <span>📣</span>}
                  {m === "Design" && <span>🎨</span>}
                  {m === "DSA" && <span>📚</span>}
                  {m === "School" && <span>🏫</span>}
                  {m === "Chill" && <span>😌</span>}
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
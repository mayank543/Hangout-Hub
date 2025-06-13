import React, { useState } from "react";
import { FaPlay, FaPause, FaCheck } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import useClockStore from "../store/useClockStore";
import { socket } from "../sockets/socket";
import { updateUserMode } from '../sockets/socket';
import useContributionStore from "../store/contributionStore";
import { FaFire, FaExternalLinkAlt, FaCode, FaBullhorn, FaPalette, FaBook, FaGraduationCap, FaCoffee, FaBolt, FaClock, FaChartBar } from "react-icons/fa";


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

  const { addFocusMinutes } = useContributionStore();

  const handleDone = () => {
    const minutes = Math.floor(time / 60);
    if (minutes > 0) {
      addFocusMinutes(minutes);
    }
    setDone();
  };

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const visibleModes = ["Code", "Market", "Design"];
  const extraModes = ["DSA", "School", "Chill"];
  
  const isExtraMode = extraModes.includes(mode);
  
  const displayModes = isExtraMode 
    ? [...visibleModes.slice(0, 2), mode]
    : visibleModes;

  const [showDropdown, setShowDropdown] = useState(false);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    updateUserMode(newMode);
  };

  return (
<div className="bg-black/15 backdrop-blur-xl border border-white/10 text-white p-4 rounded-3xl shadow-2xl w-full sm:w-[500px] mx-auto flex flex-col items-center">      <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 opacity-80">Ready to lock in?</p>

      {/* Timer and buttons */}
      <div className="flex items-center gap-4 sm:gap-8 mb-3 sm:mb-4">
        <div className="text-xl sm:text-3xl font-mono tracking-wide sm:tracking-widest">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>

        <div className="flex gap-2 sm:gap-3 items-center">
          <button
            onClick={toggleRunning}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition ${
              isRunning
                ? "bg-red-500/20 hover:bg-red-500/30"
                : "bg-green-500/20 hover:bg-green-500/30"
            }`}
          >
            {isRunning ? <FaPause size={12} className="sm:text-sm" /> : <FaPlay size={12} className="sm:text-sm" />}
          </button>

          <button
            onClick={setDone}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center transition"
          >
            <FaCheck size={12} className="sm:text-sm" />
          </button>

          <button
            onClick={togglePomodoro}
            className={`w-10 h-8 sm:w-14 sm:h-10 rounded-full flex items-center justify-between px-1.5 sm:px-2 transition backdrop-blur-md border border-white/20 ${
              isPomodoro
                ? "bg-pink-500/20 hover:bg-pink-500/30"
                : "bg-gray-500/20 hover:bg-gray-500/30"
            }`}
          >
            <MdOutlineTimer size={14} className="sm:text-base" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white/80 rounded-full" />
          </button>
        </div>
      </div>

      {/* Mode Tabs and Dropdown */}
      <div className="flex gap-2 sm:gap-3 w-full justify-center relative flex-wrap">
        {displayModes.map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition backdrop-blur-md border border-white/10 flex-shrink-0 ${
              mode === m
                ? "bg-blue-500/30 text-white border-blue-400/30"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span className="text-xs sm:text-sm">
  {m === "Code" && <FaCode />}
  {m === "Market" && <FaBullhorn />}
  {m === "Design" && <FaPalette />}
  {m === "DSA" && <FaBook />}
  {m === "School" && <FaGraduationCap />}
  {m === "Chill" && <FaCoffee />}
</span>
            <span className="hidden sm:inline">{m}</span>
            <span className="sm:hidden text-[10px]">{m.slice(0, 3)}</span>
          </button>
        ))}

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-medium transition backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 flex-shrink-0"
          >
            <span className="text-[8px] sm:text-[10px]">⋯</span>
          </button>

          {showDropdown && (
            <div className="absolute bottom-full mb-2 right-0 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl shadow-2xl z-50 py-2 min-w-[100px] sm:min-w-[120px]">
              {[...visibleModes, ...extraModes]
                .filter(m => !displayModes.includes(m))
                .map((m, index, filteredArray) => (
                <button
                  key={m}
                  onClick={() => {
                    handleModeChange(m);
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition ${
                    mode === m
                      ? "bg-blue-500/30 text-white"
                      : "text-gray-300 hover:bg-white/10"
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredArray.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <span className="text-xs sm:text-sm">
                    {m === "Code" && "💻"}
                    {m === "Market" && "📣"}
                    {m === "Design" && "🎨"}
                    {m === "DSA" && "📚"}
                    {m === "School" && "🏫"}
                    {m === "Chill" && "😌"}
                  </span>
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
// src/components/FocusClock.jsx
import React from "react";
import { FaPlay, FaPause, FaCheck } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import useClockStore from "../store/useClockStore";

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

  const modes = ["Code", "Market", "Design"];

  return (
    <div className="bg-black/15 backdrop-blur-xl border border-white/10 text-white p-4 rounded-3xl shadow-2xl w-[500px] mx-auto flex flex-col items-center">
      <p className="text-sm font-medium mb-3 opacity-80">Ready to lock in?</p>

      {/* Timer and buttons side by side */}
      <div className="flex items-center gap-8 mb-4">
        {/* Timer display */}
        <div className="text-3xl font-mono tracking-widest">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>

        {/* Control buttons */}
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

      {/* Mode selection */}
      <div className="flex gap-3 w-full justify-center">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-md border border-white/10 ${
              mode === m
                ? "bg-blue-500/30 text-white border-blue-400/30"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {m === "Code" && <span>💻</span>}
            {m === "Market" && <span>📣</span>}
            {m === "Design" && <span>🎨</span>}
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
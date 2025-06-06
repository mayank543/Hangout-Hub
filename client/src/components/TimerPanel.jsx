import { useState, useEffect, useRef } from "react";
import { FaPlay, FaRedo } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import useTimerStore from "../store/useTimerStore";

const pad = (n) => String(n).padStart(2, "0");

export default function TimerPanel() {
  const { isPomodoro, togglePomodoro, currentMode, setMode } = useTimerStore();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(0);
  };

  const activatePomodoro = () => {
    togglePomodoro();
    resetTimer();
    setSeconds(0);
  };

  const displayedSeconds = isPomodoro ? 25 * 60 : seconds;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  useEffect(() => {
    if (isPomodoro && seconds === 25 * 60) {
      clearInterval(intervalRef.current);
      setRunning(false);
    }
  }, [seconds, isPomodoro]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-4 w-[420px] text-white flex flex-col items-center shadow-2xl">
      <p className="text-sm text-gray-300 mb-2">Ready to lock in on your idea?</p>

      {/* Timer Display */}
      <div className="text-3xl font-mono tracking-widest mb-3">
        {pad(hours)}:{pad(mins)}:{pad(secs)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={startTimer}
          className="bg-green-600 hover:bg-green-700 p-2 rounded-full"
        >
          <FaPlay />
        </button>
        <button
          onClick={resetTimer}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
        >
          <FaRedo />
        </button>
        <button
          onClick={activatePomodoro}
          className={`${
            isPomodoro ? "bg-pink-700" : "bg-gray-700"
          } hover:bg-pink-800 p-2 rounded-full`}
        >
          <MdOutlineTimer />
        </button>
        <div className="ml-2 text-sm text-gray-400">{isPomodoro ? "Pomodoro Mode" : "Free Timer"}</div>
      </div>

      {/* Modes */}
      <div className="flex gap-4">
        {["Code", "Market", "Design"].map((mode) => (
          <button
            key={mode}
            onClick={() => setMode(mode)}
            className={`px-4 py-1 border rounded-full ${
              currentMode === mode
                ? "bg-white text-black border-white"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
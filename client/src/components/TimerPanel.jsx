import { useEffect } from "react";
import useTimerStore from "../store/useTimerStore";

export default function ClockPanel() {
  const { currentTime, updateTime } = useClockStore();

  useEffect(() => {
    updateTime(); // Initialize immediately
    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [updateTime]);

  return (
    <div className="fixed top-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg font-mono text-lg">
      ⏰ {currentTime}
    </div>
  );
}
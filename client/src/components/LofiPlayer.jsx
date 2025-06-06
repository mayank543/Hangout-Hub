import { useRef, useEffect } from "react";
import useAudioStore from "../store/useAudioStore";

export default function LofiPlayer() {
  const audioRef = useRef(null);
  const { isPlaying, setIsPlaying, volume } = useAudioStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, volume]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/lofi-bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="absolute bottom-8 left-8 z-20 text-white">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/10 border border-white px-4 py-2 rounded hover:bg-white/20"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <audio
        ref={audioRef}
        src="/assets/lofi.mp3"
        loop
        autoPlay
        preload="auto"
      />
    </div>
  );
}
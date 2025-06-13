import { useRef, useEffect, useState } from "react";
import useAudioStore from "../store/useAudioStore";
import useAppStore from "../store/useAppStore";

export default function LofiPlayer() {
  const audioRef = useRef(null);
  const { isPlaying, volume, setIsPlaying } = useAudioStore();
  const { backgroundIndex, backgroundVideos } = useAppStore();
const currentVideo = backgroundVideos[backgroundIndex];
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        // Optionally start music after first interaction
        setIsPlaying(true);
      }
    };

    // Listen for first user interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [userInteracted, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    
    if (isPlaying && userInteracted) {
      audio.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, userInteracted]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
  key={currentVideo} // ensures video reloads on change
  autoPlay
  loop
  muted
  className="absolute inset-0 w-full h-full object-cover z-0"
>
  <source src={currentVideo} type="video/mp4" />
</video>

      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {!userInteracted && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button 
            onClick={() => {
              setUserInteracted(true);
              setIsPlaying(true);
            }}
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            🎵 Click to Start Music
          </button>
        </div>
      )}

      <audio 
        ref={audioRef}
        src="/assets/lofi.mp3"
        loop
        preload="auto"
      />
    </div>
  );
}
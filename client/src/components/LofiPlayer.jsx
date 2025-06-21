import { useRef, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import useAudioStore from "../store/useAudioStore";
import useAppStore from "../store/useAppStore";

export default function LofiPlayer() {
  const audioRef = useRef(null);
  const { isSignedIn } = useUser(); // Get sign-in status
  const { isPlaying, volume, setIsPlaying, track } = useAudioStore();
  const { backgroundIndex, backgroundVideos } = useAppStore();
  
  // Conditionally select video based on sign-in status
  const currentVideo = isSignedIn 
    ? backgroundVideos[backgroundIndex] 
    : "/assets/bg2.mp4"; // Use bg2.mp4 for non-signed-in users
    
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
         
    // ✅ Only play if we have a track (not YouTube) and user has interacted
    if (isPlaying && userInteracted && track) {
      audio.play().catch(error => {
        console.log("Audio playback failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, userInteracted, track]);

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

      {/* ✅ Only render audio element when we have a track (not YouTube) */}
      {track && (
        <audio
          ref={audioRef}
          src={track}
          loop
          preload="auto"
        />
      )}
    </div>
  );
}
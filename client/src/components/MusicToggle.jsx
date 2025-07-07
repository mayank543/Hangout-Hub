import { useState, useEffect, useRef } from "react";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { IoMdArrowDropdown } from "react-icons/io";
import useAudioStore from "../store/useAudioStore";

const MusicToggle = () => {
  const {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    track,
    setTrack,
    tracks,
  } = useAudioStore();

  const audioRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showMusicDropdown, setShowMusicDropdown] = useState(false);
  // Initialize selectedTrack based on current track from store
  const [selectedTrack, setSelectedTrack] = useState(() => {
    if (track) {
      // Extract filename from full path
      const filename = track.split('/').pop();
      return filename;
    }
    return "lofi1.mp3";
  });
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeId, setYoutubeId] = useState(null);
  const [arcFlash, setArcFlash] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      if (track && isPlaying && !youtubeId) {
        // Load the new track and play
        audioRef.current.load(); // This ensures the new src is loaded
        audioRef.current.play().catch((err) => {
          console.error("Playback error:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [track, volume, isPlaying, youtubeId]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMusicDropdown(false);
        setShowTrackList(false);
      }
    };

    if (showMusicDropdown || showTrackList) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMusicDropdown, showTrackList]);

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleTrackChange = (value) => {
    // Stop current audio before changing track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setSelectedTrack(value);
    setYoutubeId(null);
    setTrack(`/assets/${value}`);
    setIsPlaying(true);
    
    // Trigger arc flash effect
    setArcFlash(true);
    setTimeout(() => setArcFlash(false), 400);
  };

  const handleYouTubePlay = () => {
    const id = extractYouTubeId(youtubeUrl);
    if (id) {
      // Stop current audio before playing YouTube
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setYoutubeId(id);
      setTrack(null);
      setIsPlaying(true);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setShowMusicDropdown(!showMusicDropdown)}
        className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm ${
          isPlaying
            ? "bg-blue-500/30 border-blue-400/50 hover:bg-blue-500/40"
            : "bg-white/10 border-white/20 hover:bg-white/20"
        }`}
      >
        <HiOutlineMusicalNote className="text-sm sm:text-base flex-shrink-0" />
        <IoMdArrowDropdown className="text-xs sm:text-sm hidden sm:inline" />
      </button>

      {/* Dropdown Menu */}
      {showMusicDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-lg shadow-xl p-4 z-50">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full mb-3 py-2 px-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200"
          >
            {isPlaying ? "Pause Music" : "Play Music"}
          </button>

          {/* Volume Slider */}
          <div className="mb-3">
            <label htmlFor="volume" className="block text-sm mb-1">
              Volume
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer backdrop-blur-sm slider"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          {/* Arc Dialer Track Selector */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Select Track</label>
            <div 
              className="relative w-full h-16 mx-auto cursor-pointer"
              onWheel={(e) => {
                e.preventDefault();
                const currentIndex = tracks.findIndex(t => t.value === selectedTrack);
                let newIndex;
                
                if (e.deltaY > 0) {
                  // Scroll down - next track
                  newIndex = (currentIndex + 1) % tracks.length;
                } else {
                  // Scroll up - previous track
                  newIndex = (currentIndex - 1 + tracks.length) % tracks.length;
                }
                
                handleTrackChange(tracks[newIndex].value);
              }}
            >
              {/* Less curved arc that ends at container edges */}
              <svg className="absolute w-full h-full" viewBox="0 0 256 64">
                {/* Background Arc */}
                <path
                  d="M 0 50 Q 128 10 256 50"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                
                {/* Active Arc - Always full but changes color */}
                <path
                  d="M 0 50 Q 128 10 256 50"
                  fill="none"
                  stroke={arcFlash ? "rgba(100,200,255,0.9)" : "rgba(255,255,255,0.6)"}
                  strokeWidth="3"
                  className="transition-all duration-400 ease-out"
                />
              </svg>
              
              {/* Center Pointer */}
              <div className="absolute left-1/2 transform -translate-x-1/2" style={{bottom: '14px'}}>
                <div 
                  className="w-0.5 h-5 bg-white transition-all duration-300 ease-out origin-bottom rounded-full"
                  style={{
                    transform: `rotate(${(tracks.findIndex(t => t.value === selectedTrack) * 90) / (tracks.length - 1) - 45}deg)`,
                    boxShadow: arcFlash ? '0 0 8px rgba(100,200,255,0.8)' : '0 0 4px rgba(255,255,255,0.3)'
                  }}
                ></div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                     style={{
                       boxShadow: arcFlash ? '0 0 6px rgba(100,200,255,0.8)' : '0 0 2px rgba(255,255,255,0.3)'
                     }}
                ></div>
              </div>
            </div>
            
            {/* Track Name Display - Outside the arc container */}
            <div className="text-center mt-2 min-h-[20px] relative">
              <button
                onClick={() => setShowTrackList(!showTrackList)}
                className="text-xs font-medium text-white hover:text-green-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
              >
                {tracks.find(t => t.value === selectedTrack)?.label || 'Lofi Chill'}
              </button>
              
              {/* Track Selection Dropdown */}
              {showTrackList && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-40 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-10 max-h-32 overflow-y-auto">
                  {tracks.map((trackItem) => (
                    <button
                      key={trackItem.value}
                      onClick={() => {
                        handleTrackChange(trackItem.value);
                        setShowTrackList(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-white/20 transition-colors duration-200 ${
                        selectedTrack === trackItem.value 
                          ? 'bg-white/10 text-green-300' 
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {trackItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm mb-1">YouTube Link</label>
            <input
              type="text"
              placeholder="Paste YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 text-sm placeholder-white/50 hover:bg-white/20 focus:bg-white/20 focus:border-white/30 transition-all duration-200"
            />
            <button
              onClick={handleYouTubePlay}
              className="mt-2 w-full py-2 px-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200"
            >
              Play from YouTube
            </button>
          </div>
        </div>
      )}

      {/* Local Audio Player */}
      {!youtubeId && track && <audio ref={audioRef} src={track} loop />}

      {/* YouTube Audio */}
      {youtubeId && isPlaying && (
        <iframe
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}`}
          title="YouTube Audio"
          frameBorder="0"
          allow="autoplay"
        />
      )}

      {/* Custom styles for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MusicToggle;
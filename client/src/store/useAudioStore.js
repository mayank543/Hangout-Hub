import { create } from "zustand";

const useAudioStore = create((set) => ({
  isPlaying: false,
  setIsPlaying: (val) => set({ isPlaying: val }),

  volume: 0.5,
  setVolume: (val) => set({ volume: val }),

  track: "/assets/lofi.mp3", // ✅ updated path
  setTrack: (val) => set({ track: val }),

  tracks: [
    { label: "Lofi Chill", value: "lofi1.mp3" },
    { label: "Night Beats", value: "lofi2.mp3" },
    { label: "Soft Rain", value: "rain.mp3" },
  ],
}));

export default useAudioStore;
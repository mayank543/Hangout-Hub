import { create } from "zustand";

const useAudioStore = create((set) => ({
  isPlaying: false,
  setIsPlaying: (val) => set({ isPlaying: val }),
  volume: 0.5,
  setVolume: (val) => set({ volume: val }),
}));

export default useAudioStore;
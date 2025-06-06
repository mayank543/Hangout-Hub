import { create } from "zustand";

const useAppStore = create((set) => ({
  isMusicPlaying: true,
  toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),
  currentRoom: "My Room",
  onlineUsers: 3,
  lockedDays: 0,
}));

export default useAppStore;
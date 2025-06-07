// src/store/useAppStore.js
import { create } from "zustand";

const useAppStore = create((set) => ({
  isMusicPlaying: true,
  toggleMusic: () =>
    set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),

  currentRoom: "My Room",

  // ✅ Change onlineUsers from a number to an array
  onlineUsers: [],

  // ✅ Add this setter to update online users from socket
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  lockedDays: 0,

  // ✅ Controls visibility of the online users panel
  showOnlineUsers: false,
  toggleOnlineUsers: () =>
    set((state) => ({ showOnlineUsers: !state.showOnlineUsers })),
}));

export default useAppStore;
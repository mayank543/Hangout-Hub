// src/store/useAppStore.js
import { create } from "zustand";

const useAppStore = create((set) => ({
  

  // inside create(...)

   currentUserId: null,
setCurrentUserId: (id) => set({ currentUserId: id }),
profileEditorOpen: false,
toggleProfileEditor: () =>
    set((state) => ({ profileEditorOpen: !state.profileEditorOpen })),

updateCurrentUserProfile: (updatedFields) =>
  set((state) => ({
    onlineUsers: state.onlineUsers.map((user) =>
      user.id === state.currentUserId ? { ...user, ...updatedFields } : user
    ),
  })),



  currentRoom: "My Room",

  dailyFocusTime: 0,
incrementFocusTime: () =>
  set((state) => ({ dailyFocusTime: state.dailyFocusTime + 1 })),

  selectedUser: null,
  openChatWith: (user) => set({ selectedUser: user }),
  closeChat: () => set({ selectedUser: null }),

  onlineUsers: [],

  // Set the entire array of online users (e.g. from socket)
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // ✅ NEW: Update a specific user’s data (e.g. focus time)
  updateOnlineUserData: (userId, updatedFields) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedFields } : user
      ),
    })),

  lockedDays: 0,

  showOnlineUsers: false,
  toggleOnlineUsers: () =>
    set((state) => ({ showOnlineUsers: !state.showOnlineUsers })),
}));

export default useAppStore;
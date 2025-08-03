// src/store/useAppStore.js
import { create } from "zustand";


const backgroundVideos = [
  "/assets/lofi-bg.mp4",
  "/assets/bg1.mp4",
  "/assets/bg2.mp4",
];

// Helper function to load profile data from localStorage
const loadProfileFromStorage = (userId) => {
  if (!userId) return {};
  
  try {
    const savedData = localStorage.getItem(`userProfile_${userId}`);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error('Error loading profile from localStorage:', error);
    return {};
  }
};

// Helper function to save profile data to localStorage
const saveProfileToStorage = (userId, profileData) => {
  if (!userId) return;
  
  try {
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profileData));
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
  }
};

const useAppStore = create((set, get) => ({
 backgroundIndex: 0,
  backgroundVideos,

  nextBackground: () =>
    set((state) => ({
      backgroundIndex: (state.backgroundIndex + 1) % state.backgroundVideos.length,
    })),

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

  // Enhanced setOnlineUsers that merges with localStorage data
  setOnlineUsers: (users) => {
    const { currentUserId } = get();
    
    // Merge users with their saved profile data from localStorage
    const usersWithSavedProfiles = users.map(user => {
      const savedProfile = loadProfileFromStorage(user.id);
      return {
        ...user,
        ...savedProfile, // This will add project, website, status if they exist in localStorage
      };
    });
    
    set({ onlineUsers: usersWithSavedProfiles });
  },

  // Enhanced updateOnlineUserData that also saves to localStorage
  updateOnlineUserData: (userId, updatedFields) => {
    // Check if we're updating profile fields that should be saved
    const profileFields = ['project', 'website', 'status'];
    const profileUpdates = {};
    
    profileFields.forEach(field => {
      if (updatedFields.hasOwnProperty(field)) {
        profileUpdates[field] = updatedFields[field];
      }
    });
    
    // If we have profile updates, save them to localStorage
    if (Object.keys(profileUpdates).length > 0) {
      const currentProfile = loadProfileFromStorage(userId);
      const newProfile = { ...currentProfile, ...profileUpdates };
      saveProfileToStorage(userId, newProfile);
    }
    
    // Update the store
    set((state) => ({
      onlineUsers: state.onlineUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedFields } : user
      ),
    }));
  },

  // New method to clear profile data from localStorage
  clearUserProfile: (userId) => {
    try {
      localStorage.removeItem(`userProfile_${userId}`);
      
      // Also clear from the current online users
      set((state) => ({
        onlineUsers: state.onlineUsers.map((user) =>
          user.id === userId 
            ? { ...user, project: '', website: '', status: '' }
            : user
        ),
      }));
    } catch (error) {
      console.error('Error clearing profile from localStorage:', error);
    }
  },

  // Method to get saved profile data
  getSavedProfile: (userId) => {
    return loadProfileFromStorage(userId);
  },

  lockedDays: 0,

  showOnlineUsers: false,
  toggleOnlineUsers: () =>
    set((state) => ({ showOnlineUsers: !state.showOnlineUsers })),
}));

export default useAppStore;
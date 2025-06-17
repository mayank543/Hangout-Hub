import { create } from 'zustand';

const useChatStore = create((set) => ({
  onlineUsers: [],
  activeChatUser: null,
  messages: {}, // { userId: [ { from, text, time } ] }
  unreadCounts: {}, // { userId: count }

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setActiveChatUser: (user) => set({ activeChatUser: user }),

  addMessage: (userId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userId]: [...(state.messages[userId] || []), message],
      },
    })),

  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),

  resetUnread: (userId) =>
    set((state) => {
      const updated = { ...state.unreadCounts };
      delete updated[userId];
      return { unreadCounts: updated };
    }),

  resetAllUnread: () => set({ unreadCounts: {} }),
}));

export default useChatStore;
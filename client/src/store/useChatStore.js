import { create } from 'zustand';

const useChatStore = create((set) => ({
  onlineUsers: [],
  activeChatUser: null,
  messages: {}, // { userId: [ { from, text, time } ] }

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setActiveChatUser: (user) => set({ activeChatUser: user }),
  addMessage: (userId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userId]: [...(state.messages[userId] || []), message],
      },
    })),
}));

export default useChatStore;
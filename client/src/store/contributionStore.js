// 🧠 src/store/contributionStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

const useContributionStore = create(
  persist(
    (set, get) => ({
      focusData: {}, // { '2025-06-09': 45, '2025-06-08': 20 }

      addFocusMinutes: (minutes) =>
        set((state) => {
          const today = format(new Date(), 'yyyy-MM-dd');
          const current = state.focusData[today] || 0;
          return {
            focusData: {
              ...state.focusData,
              [today]: current + minutes,
            },
          };
        }),

      resetFocusData: () => set({ focusData: {} }),

      getFocusMinutes: (date) => {
        const state = get();
        const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
        return state.focusData[dateStr] || 0;
      },

      getTotalFocusTime: () => {
        const state = get();
        return Object.values(state.focusData).reduce((total, minutes) => total + minutes, 0);
      },
    }),
    {
      name: 'contribution-storage',
      version: 1,
      // Fix the migration warning
      migrate: (persistedState, version) => {
        // Just return the persisted state as-is
        return persistedState;
      },
    }
  )
);

export default useContributionStore;
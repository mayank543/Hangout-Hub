// 🧠 src/store/contributionStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

const useContributionStore = create(
  persist(
    (set) => ({
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
    }),
    {
      name: 'contribution-storage', // 🔐 localStorage key
    }
  )
);

export default useContributionStore;
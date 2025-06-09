// 🧠 src/store/contributionStore.js
import { create } from "zustand";
import { format } from "date-fns";

const useContributionStore = create((set) => ({
  focusData: {}, // { '2025-06-09': 45, '2025-06-08': 20 } ← minutes focused per day

  addFocusMinutes: (minutes) =>
    set((state) => {
      const today = format(new Date(), "yyyy-MM-dd");
      const current = state.focusData[today] || 0;
      return {
        focusData: {
          ...state.focusData,
          [today]: current + minutes,
        },
      };
    }),

  resetFocusData: () => set({ focusData: {} }),
}));

export default useContributionStore;
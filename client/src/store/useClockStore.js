import { create } from 'zustand';

const POMODORO_DURATION = 25 * 60;
let interval = null;

const useClockStore = create((set, get) => ({
  isRunning: false,
  isPomodoro: false,
  time: 0,
  mode: 'Code',

  // NEW: daily focus time tracker
  dailyFocusTime: 0,
  lastUpdatedDate: new Date().toDateString(),

  updateDailyFocus: () => {
    const { dailyFocusTime, lastUpdatedDate } = get();
    const today = new Date().toDateString();

    if (today !== lastUpdatedDate) {
      set({ dailyFocusTime: 1, lastUpdatedDate: today }); // reset new day
    } else {
      set({ dailyFocusTime: dailyFocusTime + 1 });
    }
  },

  toggleRunning: () => {
    const { isRunning } = get();
    if (interval) clearInterval(interval);

    if (!isRunning) {
      interval = setInterval(() => {
        set((state) => {
          const nextTime = state.isPomodoro
            ? Math.max(state.time - 1, 0)
            : state.time + 1;

          // Update daily focus time only in non-Pomodoro (focus) mode
          if (!state.isPomodoro) {
            get().updateDailyFocus();
          }

          return { time: nextTime };
        });
      }, 1000);
    }

    set({ isRunning: !isRunning });
  },

  togglePomodoro: () => {
    if (interval) clearInterval(interval);
    set({
      isPomodoro: !get().isPomodoro,
      time: !get().isPomodoro ? POMODORO_DURATION : 0,
      isRunning: false,
    });
  },

  setDone: () => {
    if (interval) clearInterval(interval);
    set({ isRunning: false, time: 0 });
  },

  setMode: (mode) => set({ mode }),
}));

export default useClockStore;
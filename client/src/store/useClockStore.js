// src/store/useClockStore.js
import { create } from 'zustand';

const POMODORO_DURATION = 25 * 60;

let interval = null;

const useClockStore = create((set, get) => ({
  isRunning: false,
  isPomodoro: false,
  time: 0,
  mode: 'Code',

  toggleRunning: () => {
    const { isRunning } = get();
    if (interval) clearInterval(interval);

    if (!isRunning) {
      interval = setInterval(() => {
        set((state) => {
          const nextTime = state.isPomodoro
            ? Math.max(state.time - 1, 0)
            : state.time + 1;
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
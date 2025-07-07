import { create } from "zustand";

const useTimerStore = create((set) => ({
  isPomodoro: false,
  togglePomodoro: () => set((state) => ({ isPomodoro: !state.isPomodoro })),
  currentMode: "Code",
  setMode: (mode) => set({ currentMode: mode }),
}));

export default useTimerStore;
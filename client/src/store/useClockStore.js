import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useContributionStore from "./contributionStore"; // ⬅️ Add at the top of the file

const POMODORO_DURATION = 25 * 60;
let interval = null;

const useClockStore = create(
  persist(
    (set, get) => ({
      isRunning: false,
      isPomodoro: false,
      time: 0,
      mode: 'Code',
      
      // NEW: daily focus time tracker
      dailyFocusTime: 0,
      lastUpdatedDate: new Date().toDateString(),

      focusHistory: {}, // <--- NEW
      
      // NEW: persistence fields
      lastPauseTimestamp: null,
      sessionStartTime: null,
      
      // NEW: Pomodoro break tracking
      isOnBreak: false, // tracks if currently on break period

      updateDailyFocus: () => {
  const { dailyFocusTime, lastUpdatedDate, focusHistory } = get();
  const today = new Date().toDateString();

  if (today !== lastUpdatedDate) {
    set({
      dailyFocusTime: 1,
      lastUpdatedDate: today,
      focusHistory: {
        ...focusHistory,
        [lastUpdatedDate]: dailyFocusTime,
      },
    });
  } else {
    set({ dailyFocusTime: dailyFocusTime + 1 });
  }
},

      // NEW: Initialize store on app load
      initializeStore: () => {
        const state = get();
        const today = new Date().toDateString();
        
        // Reset daily focus time if it's a new day
        if (today !== state.lastUpdatedDate) {
          set({ 
            dailyFocusTime: 0, 
            lastUpdatedDate: today,
            time: 0, // Reset timer for new day
            isRunning: false,
            isOnBreak: false, // Reset break status
            lastPauseTimestamp: null,
            sessionStartTime: null
          });
        } else if (state.lastPauseTimestamp && !state.isRunning) {
          // If we have a pause timestamp and we're not running, keep the paused time
          // This handles the case where user refreshed while timer was paused
          console.log('Restored paused timer from:', state.time);
        }
      },

      toggleRunning: () => {
        const { isRunning, time } = get();
        if (interval) clearInterval(interval);

        if (!isRunning) {
          // Starting the timer
          const now = Date.now();
          set({ 
            sessionStartTime: now,
            lastPauseTimestamp: null 
          });
          
          interval = setInterval(() => {
            const state = get();
            const nextTime = state.isPomodoro
              ? Math.max(state.time - 1, 0)
              : state.time + 1;

            // Handle Pomodoro transitions
            if (state.isPomodoro && state.time === 1) {
              // Timer about to finish - switch between work and break
              const willBeOnBreak = !state.isOnBreak;
              const nextPomodoroTime = willBeOnBreak ? 5 * 60 : POMODORO_DURATION; // 5 min break or 25 min work
              
              set({ 
                time: nextPomodoroTime,
                isOnBreak: willBeOnBreak
              });
              return;
            }

            // Update daily focus time - only count work time, not break time
            const shouldCountFocus = state.isPomodoro 
              ? !state.isOnBreak // Only count if NOT on break
              : true; // Always count for regular timer
              
            if (shouldCountFocus) {
              // Count focus time for: regular timer (counting up) OR pomodoro work session (counting down)
              const today = new Date().toDateString();
              if (today !== state.lastUpdatedDate) {
                set({ 
                  time: nextTime, 
                  dailyFocusTime: 1, 
                  lastUpdatedDate: today 
                });
              } else {
                set({ 
                  time: nextTime, 
                  dailyFocusTime: state.dailyFocusTime + 1 
                });
              }
            } else {
              // Just update time (break time in pomodoro)
              set({ time: nextTime });
            }
          }, 1000);
        } else {
          // Pausing the timer
          const now = Date.now();
          set({ 
            lastPauseTimestamp: now,
            sessionStartTime: null 
          });
        }

        set({ isRunning: !isRunning });
      },

      togglePomodoro: () => {
        if (interval) clearInterval(interval);
        const willBePomodoro = !get().isPomodoro;
        set({
          isPomodoro: willBePomodoro,
          time: willBePomodoro ? POMODORO_DURATION : 0,
          isRunning: false,
          isOnBreak: false, // Always start with work session
          lastPauseTimestamp: null,
          sessionStartTime: null,
        });
      },

 setDone: () => {
  if (interval) clearInterval(interval);

  const { dailyFocusTime, lastUpdatedDate, focusHistory } = get();
  const today = new Date().toDateString();

  const focusMinutes = Math.floor(dailyFocusTime / 60); // ✅ converts seconds to minutes

  const addFocusMinutes = useContributionStore.getState().addFocusMinutes;
  if (focusMinutes > 0) addFocusMinutes(focusMinutes); // ✅ sends to contribution store

  set({
    isRunning: false,
    time: 0,
    isOnBreak: false,
    lastPauseTimestamp: null,
    sessionStartTime: null,
    focusHistory: {
      ...focusHistory,
      [today]: (focusHistory[today] || 0) + dailyFocusTime,
    },
    
  });
},

      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'hangout-hub-clock-storage', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist these fields
        time: state.time,
        mode: state.mode,
        isPomodoro: state.isPomodoro,
        isOnBreak: state.isOnBreak, // Persist break status
        dailyFocusTime: state.dailyFocusTime,
        lastUpdatedDate: state.lastUpdatedDate,
        lastPauseTimestamp: state.lastPauseTimestamp,
        sessionStartTime: state.sessionStartTime,
        focusHistory: state.focusHistory,
        // Don't persist isRunning - always start as paused after refresh
      }),
      onRehydrateStorage: () => (state) => {
        // This runs after the store is rehydrated from localStorage
        if (state) {
          state.initializeStore();
        }
      },
    }
  )
);

export default useClockStore;
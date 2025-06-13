import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// Mock date-fns functions for demo
const format = (date, formatStr) => {
  if (formatStr === 'yyyy-MM-dd') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (formatStr === 'MMM') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }
  return date.toString();
};

const startOfWeek = (date, options = {}) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (options.weekStartsOn || 0);
  return new Date(d.setDate(diff));
};

const eachDayOfInterval = ({ start, end }) => {
  const days = [];
  let current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const endOfToday = () => new Date();

const clsx = (...classes) => classes.filter(Boolean).join(' ');

// Mock zustand store for demo - empty by default, will use real data
const useContributionStore = create(
  persist(
    (set) => ({
      focusData: {},

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
      name: 'contribution-storage',
    }
  )
);

const getColor = (hours) => {
  if (hours >= 4) return 'bg-green-500';               // Deep
  if (hours >= 2 && hours < 4) return 'bg-green-400';  // Medium
  if (hours >= 1 && hours < 2) return 'bg-green-300';  // Light
  if (hours > 0 && hours < 1) return 'bg-green-200';   // Very Light
  return 'bg-gray-600/30';                             // None - subtle gray for dark theme
};

const ContributionCalendar = ({ onClose }) => {
  const { focusData = {} } = useContributionStore();

  const today = new Date();
  const start = startOfWeek(new Date(today.setDate(today.getDate() - 364)), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end: endOfToday() });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center px-2 sm:px-4 md:px-8 py-4 sm:py-8 bg-black/80 backdrop-blur-sm text-white overflow-auto">
      {/* Close button - better mobile positioning */}
      <button 
        className="absolute top-14 right-4 sm:top-16 sm:right-8 
                   bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 
                   transition-colors z-10 px-3 py-2 sm:px-4 sm:py-2 rounded-lg 
                   border border-red-500/30 hover:border-red-500/50 
                   text-sm sm:text-sm font-medium touch-manipulation
                   min-w-[44px] min-h-[44px] flex items-center justify-center"
        onClick={() => {
          if (onClose) {
            onClose();
          } else {
            // Fallback - try to close modal or hide component
            console.log('Close function not provided. Add onClose prop to parent component.');
          }
        }}
        title="Close Calendar"
      >
        <span className="text-lg sm:hidden">×</span>
        <span className="hidden sm:inline">Close</span>
      </button>

      <div className="flex flex-col items-center justify-center w-full max-w-none min-h-full py-12 sm:py-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-400 text-center px-4">
          Locked-in Contributions
        </h2>
        
        <div className="flex flex-col items-center w-full max-w-full">
          {/* Month labels - responsive sizing */}
          <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-400 overflow-x-auto w-full justify-center">
            <div className="flex gap-0.5 sm:gap-1">
              {weeks.map((week, i) => {
                if (i % 4 === 0 && week[0]) {
                  const monthName = format(week[0], 'MMM');
                  return <div key={i} className="w-2.5 sm:w-4 text-center text-xs sm:text-sm flex-shrink-0">{monthName}</div>;
                }
                return <div key={i} className="w-2.5 sm:w-4 flex-shrink-0"></div>;
              })}
            </div>
          </div>

          {/* Calendar grid - responsive with horizontal scroll on mobile */}
          <div className="w-full overflow-x-auto pb-2 mb-4 sm:mb-6">
            <div className="flex gap-0.5 sm:gap-1 justify-center min-w-max px-2">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-0.5 sm:gap-1">
                  {week.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const hours = (focusData[dateStr] || 0) / 60;
                    return (
                      <div
                        key={dateStr}
                        title={`${dateStr} - ${hours.toFixed(2)} hrs focused`}
                        className={clsx(
                          'w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm border border-white/5 hover:border-white/30 transition-all cursor-pointer hover:scale-110 touch-manipulation',
                          getColor(hours)
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend - responsive sizing */}
          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400">
            <span>Less</span>
            <div className="flex gap-0.5 sm:gap-1">
              <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm bg-gray-600/30 border border-white/5"></div>
              <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm bg-green-200 border border-white/5"></div>
              <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm bg-green-300 border border-white/5"></div>
              <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm bg-green-400 border border-white/5"></div>
              <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-sm bg-green-500 border border-white/5"></div>
            </div>
            <span>More</span>
          </div>

          {/* Color code legend - responsive layout */}
          <div className="text-xs text-gray-400 text-center mb-3 sm:mb-4 px-2">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              <span>0hrs</span>
              <span>•</span>
              <span className="text-green-200">&lt;1hr</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-green-300">1-2hrs</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-green-400">2-4hrs</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-green-500">4+hrs</span>
            </div>
          </div>

          {/* Stats - responsive layout */}
          <div className="text-sm sm:text-lg text-gray-300 text-center px-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-center items-center">
              <span className="text-xs sm:text-base">Total days: {Object.keys(focusData).length}</span>
              <span className="text-xs sm:text-base">Best streak: {calculateStreak(focusData)}🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate longest streak
const calculateStreak = (focusData) => {
  const dates = Object.keys(focusData).sort();
  let maxStreak = 0;
  let currentStreak = 0;
  
  dates.forEach((date, i) => {
    if (focusData[date] > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return maxStreak;
};

export default ContributionCalendar;
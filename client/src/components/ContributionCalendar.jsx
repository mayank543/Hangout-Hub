import React from 'react';
import useContributionStore from '../store/contributionStore';
import { eachDayOfInterval, startOfWeek, endOfToday, format } from 'date-fns';
import clsx from 'clsx';

const getColor = (hours) => {
  if (hours >= 4) return 'bg-green-500';               // Deep
  if (hours >= 2 && hours < 4) return 'bg-green-400';  // Medium
  if (hours >= 1 && hours < 2) return 'bg-green-300';  // Light
  if (hours > 0 && hours < 1) return 'bg-green-200';   // Very Light
  return 'bg-gray-600/30';                             // None - subtle gray for dark theme
};

const ContributionCalendar = () => {
  const { focusData = {} } = useContributionStore();

  const today = new Date();
  const start = startOfWeek(new Date(today.setDate(today.getDate() - 149)), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end: endOfToday() });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-6 bg-black/80 backdrop-blur-sm text-white rounded-xl border border-white/20 shadow-2xl max-w-max">
      <h2 className="text-xl font-bold mb-4 text-green-400">🔥 Locked-in Contributions</h2>
      
      {/* Month labels */}
      <div className="flex gap-1 mb-2 text-xs text-gray-400">
        {weeks.map((week, i) => {
          if (i % 4 === 0) {
            const monthName = format(week[0], 'MMM');
            return <div key={i} className="w-4">{monthName}</div>;
          }
          return <div key={i} className="w-4"></div>;
        })}
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hours = (focusData[dateStr] || 0) / 60;
              return (
                <div
                  key={dateStr}
                  title={`${dateStr} - ${hours.toFixed(2)} hrs focused`}
                  className={clsx(
                    'w-3 h-3 rounded-sm border border-white/5 hover:border-white/30 transition-all cursor-pointer hover:scale-110',
                    getColor(hours)
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-600/30 border border-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 border border-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300 border border-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 border border-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-green-500 border border-white/5"></div>
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-300">
        <div className="flex gap-4">
          <span>Total days: {Object.keys(focusData).length}</span>
          <span>Best streak: {calculateStreak(focusData)}🔥</span>
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
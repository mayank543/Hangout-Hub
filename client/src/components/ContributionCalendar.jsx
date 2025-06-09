import React from 'react';
import useContributionStore from '../store/contributionStore';
import { eachDayOfInterval, startOfWeek, endOfToday, format } from 'date-fns';
import clsx from 'clsx';

const getColor = (hours) => {
  if (hours >= 4) return 'bg-green-800';               // Deep
  if (hours >= 2 && hours < 4) return 'bg-green-700';  // Medium
  if (hours >= 1 && hours < 2) return 'bg-green500';  // Light
  if (hours > 0 && hours < 1) return 'bg-green-200';     // Very Light
  return 'bg-gray-200';                                // None
};

const ContributionCalendar = () => {
  const { focusData = {} } = useContributionStore();  // ✅ FIXED

  const today = new Date();
  const start = startOfWeek(new Date(today.setDate(today.getDate() - 149)), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end: endOfToday() });

  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-max">
      <h2 className="text-lg font-semibold mb-2">Locked-in Contributions</h2>
      <div className="flex gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hours = (focusData[dateStr] || 0) / 60;  // ✅ FIXED
              return (
                <div
                  key={dateStr}
                  title={`${dateStr} - ${hours.toFixed(2)} hrs`}
                  className={clsx('w-4 h-4 rounded-sm', getColor(hours))}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributionCalendar;
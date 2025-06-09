// src/components/CalendarToggleButton.jsx
import React, { useState } from "react";
import ContributionCalendar from "./ContributionCalendar";
import { CalendarDays } from "lucide-react";

const CalendarToggleButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🟢 Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 left-4 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition z-50"
        style={{ pointerEvents: "auto" }} // 👈 Ensure button is clickable
      >
        <CalendarDays size={20} />
      </button>

      {/* 🟢 Calendar Panel */}
      {open && (
        <div className="fixed bottom-16 left-4 z-50">
          <ContributionCalendar />
        </div>
      )}
    </>
  );
};

export default CalendarToggleButton;
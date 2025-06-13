// src/components/CalendarToggleButton.jsx
import React, { useState } from "react";
import ContributionCalendar from "./ContributionCalendar";
import { CalendarDays } from "lucide-react";

const CalendarToggleButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Minimalistic Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-3 left-11 bg-black/30 backdrop-blur-sm border border-gray-200/50 text-gray-600 p-3 rounded-full shadow-sm hover:shadow-md hover:text-gray-800 hover:bg-white/90 transition-all duration-200 z-50"
        style={{ pointerEvents: "auto" }}
      >
        <CalendarDays size={10} />
      </button>

      {/* Calendar Modal */}
      {open && (
        <ContributionCalendar onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default CalendarToggleButton;
// TodoToggleButton.jsx
import React from "react";
import { FaList } from "react-icons/fa";

const TodoToggleButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="bg-black/50 backdrop-blur-sm border border-gray-200/50 text-gray-600 p-3 rounded-full shadow-sm hover:shadow-md hover:text-gray-800 hover:bg-white/90 transition-all duration-200"
      style={{ pointerEvents: "auto" }}
    >
      <FaList size={10} />
    </button>
  );
};

export default TodoToggleButton;
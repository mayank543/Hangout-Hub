import { useState } from "react";
import useTodoStore from "../store/todoStore";
import { FaPlus, FaTimes, FaList, FaCalendarAlt, FaCheck } from "react-icons/fa";

export default function TodoList({ onClose }) {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("todo");
  const { tasks, addTask, toggleTask, removeTask } = useTodoStore();

  const handleAdd = () => {
    if (input.trim()) {
      addTask(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const todoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="fixed bottom-20 left-4 bg-black/20 backdrop-blur-md text-white shadow-2xl rounded-xl p-0 w-90 z-50 border border-gray-600/50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="text-lg font-medium text-white">Daily Tasks</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-900/50 mx-4 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab("todo")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === "todo"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          To-Do ({todoTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("done")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === "done"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Done ({completedTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("log")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeTab === "log"
              ? "bg-gray-600 text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Log
        </button>
      </div>

      {/* Add Task Input */}
      {activeTab === "todo" && (
        <div className="px-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-900/50 border border-gray-600 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="What do you need to do today?"
            />
            <div className="flex items-center gap-2">
              <select className="bg-gray-900/50 border border-gray-600 px-2 py-2 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gray-500">
                <option>All</option>
                <option>Work</option>
                <option>Personal</option>
              </select>
              <button 
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="px-4 pb-4">
        {activeTab === "todo" && (
          <div className="min-h-48 bg-black/20 rounded-lg p-3 border border-gray-600/30">
            {todoTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FaList className="text-4xl text-gray-500 mb-4" />
                <h4 className="text-gray-300 font-medium mb-1">No tasks to do yet</h4>
                <p className="text-gray-500 text-sm">Add up to 3 tasks to focus on today</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {todoTasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/30 rounded-lg transition-colors group">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 border-2 border-gray-500 rounded hover:border-green-500 flex items-center justify-center transition-colors"
                    >
                      {task.completed && <FaCheck className="text-green-500 text-xs" />}
                    </button>
                    <span className="flex-1 text-sm text-gray-200">
                      {task.text}
                    </span>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "done" && (
          <div className="min-h-48 bg-black/20 rounded-lg p-3 border border-gray-600/30">
            {completedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FaCheck className="text-4xl text-gray-500 mb-4" />
                <h4 className="text-gray-300 font-medium mb-1">No completed tasks</h4>
                <p className="text-gray-500 text-sm">Completed tasks will appear here</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {completedTasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/30 rounded-lg transition-colors group">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="flex-1 text-sm text-gray-400 line-through">
                      {task.text}
                    </span>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "log" && (
          <div className="flex flex-col items-center justify-center py-12 text-center min-h-48 bg-black/20 rounded-lg border border-gray-600/30">
            <FaCalendarAlt className="text-4xl text-gray-500 mb-4" />
            <h4 className="text-gray-300 font-medium mb-1">Activity Log</h4>
            <p className="text-gray-500 text-sm">Your task history will appear here</p>
          </div>
        )}
      </div>

      
    </div>
  );
}
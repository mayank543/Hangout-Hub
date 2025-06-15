import { useEffect, useRef } from "react";
import { FaFire, FaExternalLinkAlt, FaCode, FaBullhorn, FaPalette, FaBook, FaGraduationCap, FaCoffee, FaBolt, FaClock, FaChartBar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "../store/useAppStore";
import { MessageSquare, Mail } from "lucide-react";

export default function OnlineUsers() {
  const users = useAppStore((state) => state.onlineUsers);
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);
  const toggleOnlineUsers = useAppStore((state) => state.toggleOnlineUsers);
  
  // Ref for the panel container 
  const panelRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if panel is open and click is outside the panel
      if (showOnlineUsers && panelRef.current && !panelRef.current.contains(event.target)) {
        toggleOnlineUsers();
      }
    };

    // Add event listener when panel is open
    if (showOnlineUsers) {
      // Use capture phase to ensure we catch the event before other handlers
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [showOnlineUsers, toggleOnlineUsers]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  // Helper function to get mode icon and styling
  const getModeDisplay = (mode) => {
    const modeConfig = {
      Code: { icon: FaCode, color: "text-blue-400", bg: "bg-blue-500/20" },
      Market: { icon: FaBullhorn, color: "text-green-400", bg: "bg-green-500/20" },
      Design: { icon: FaPalette, color: "text-purple-400", bg: "bg-purple-500/20" },
      DSA: { icon: FaBook, color: "text-orange-400", bg: "bg-orange-500/20" },
      School: { icon: FaGraduationCap, color: "text-yellow-400", bg: "bg-yellow-500/20" },
      Chill: { icon: FaCoffee, color: "text-pink-400", bg: "bg-pink-500/20" },
    };
    
    return modeConfig[mode] || { icon: FaBolt, color: "text-gray-400", bg: "bg-gray-500/20" };
  };

  // Helper function to truncate URL for display
  const formatUrl = (url) => {
    if (!url) return '';
    
    // Remove protocol and www
    let displayUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    
    // Truncate if too long
    if (displayUrl.length > 25) {
      displayUrl = displayUrl.substring(0, 25) + '...';
    }
    
    return displayUrl;
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <AnimatePresence>
      {showOnlineUsers && (
        <>
          {/* Optional: Semi-transparent overlay for better UX indication */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/10 z-[65]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Sliding panel - more translucent background */}
          <motion.div 
            key="panel"
            ref={panelRef}
            className="fixed top-0 right-0 h-full bg-black/40 backdrop-blur-xl text-white border-l border-gray-700 z-[70] w-80"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{
              boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-4 border-b border-gray-700"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online Users ({users.length})
              </h3>
              <motion.button
                onClick={toggleOnlineUsers}
                className="p-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#323232] transition-colors duration-200"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 90,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{
                    rotate: 90,
                    transition: { duration: 0.2 }
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Scrollable content */}
            <motion.div 
              className="overflow-y-auto h-full pb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="space-y-3 p-4">
                {users.map((user, index) => {
                  const modeDisplay = getModeDisplay(user.mode);
                  return (
                    <motion.div
                      key={user.id}
                      className="bg-[#2a2a2a] rounded-lg p-3 cursor-pointer"
                      onClick={() => useAppStore.getState().openChatWith(user)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: index * 0.05,
                          duration: 0.3
                        }
                      }}
                      whileHover={{ 
                        backgroundColor: "#323232",
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            className="w-10 h-10 rounded-full"
                            alt={user.name}
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white text-base truncate">{user.name}</h4>
                            {user.streak > 1 && (
                              <motion.div 
                                className="flex items-center text-orange-400 text-sm font-medium flex-shrink-0"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  transition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                  }
                                }}
                              >
                                <FaFire className="w-3 h-3 mr-1" />
                                {user.streak}x
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                            <FaClock className="w-3 h-3" />
                            <span>{user.lockedInTime}</span>
                            <span>locked in</span>
                          </div>
                        </div>
                      </div>

                      {/* Project/Status Info Container */}
                      <div className="bg-[#1f1f1f] rounded-md p-3">
                        {/* Fixed layout with proper flex positioning */}
                        <div className="flex items-start gap-3 mb-2">
                          {/* Content Section - takes remaining space */}
                          <div className="flex-1 min-w-0">
                            {/* Project Name - with character limit */}
                            <div className="text-white font-medium mb-1 text-sm flex items-center gap-1">
                              {truncateText(user.project, 30) || "No Project"}
                              <Mail size={16} className="text-gray-400" />
                            </div>
                  
                            
                            {/* Website Link - with URL formatting */}
                            {user.website && (
                              <motion.a
                                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 mb-2 group"
                                onClick={(e) => e.stopPropagation()}
                                title={user.website}
                                whileHover={{ x: 2 }}
                              >
                                <span className="truncate">{formatUrl(user.website)}</span>
                                <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                              </motion.a>
                            )}

                            {/* Status - improved background styling */}
                            {user.status && (
                              <div 
                                className="text-gray-200 text-xs bg-black/40 border border-gray-600/30 px-2.5 py-1.5 rounded-md inline-block max-w-full backdrop-blur-sm"
                                title={user.status}
                              >
                                <span className="truncate">{truncateText(user.status, 40)}</span>
                              </div>
                            )}
                          </div>

                          {/* Mode Badge - fixed position, won't be pushed */}
                          {user.mode && (
                            <motion.div 
                              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${modeDisplay.bg} ${modeDisplay.color} flex-shrink-0`}
                              whileHover={{ scale: 1.05 }}
                            >
                              <modeDisplay.icon className="w-3 h-3" />
                              <span>{user.mode}</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Daily Focus Time */}
                        {user.dailyFocusTime !== undefined && (
                          <div className="text-xs text-blue-300 mt-2 flex items-center gap-1">
                            <FaChartBar className="w-3 h-3" />
                            <span>Focused: {formatTime(user.dailyFocusTime)}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
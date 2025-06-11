import { FaFire, FaExternalLinkAlt } from "react-icons/fa";
import useAppStore from "../store/useAppStore";

export default function OnlineUsers() {
  const users = useAppStore((state) => state.onlineUsers);
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);

  if (!showOnlineUsers) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  // Helper function to get mode emoji and styling
  const getModeDisplay = (mode) => {
    const modeConfig = {
      Code: { emoji: "💻", color: "text-blue-400", bg: "bg-blue-500/20" },
      Market: { emoji: "📣", color: "text-green-400", bg: "bg-green-500/20" },
      Design: { emoji: "🎨", color: "text-purple-400", bg: "bg-purple-500/20" },
      DSA: { emoji: "📚", color: "text-orange-400", bg: "bg-orange-500/20" },
      School: { emoji: "🏫", color: "text-yellow-400", bg: "bg-yellow-500/20" },
      Chill: { emoji: "😌", color: "text-pink-400", bg: "bg-pink-500/20" },
    };
    
    return modeConfig[mode] || { emoji: "⚡", color: "text-gray-400", bg: "bg-gray-500/20" };
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
    <div className="absolute top-20 right-4 bg-[#1a1a1a] text-white rounded-lg p-4 border border-gray-700 z-50 w-80 max-h-[80vh] overflow-y-auto backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-200 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Online Users ({users.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {users.map((user) => {
          const modeDisplay = getModeDisplay(user.mode);
          return (
            <div
              key={user.id}
              className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#323232] transition-colors cursor-pointer"
              onClick={() => useAppStore.getState().openChatWith(user)}
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
                      <div className="flex items-center text-orange-400 text-sm font-medium flex-shrink-0">
                        <FaFire className="w-3 h-3 mr-1" />
                        {user.streak}x
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                    <span>⏰</span>
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
                    <div className="text-white font-medium mb-1 text-sm">
                      {truncateText(user.project, 30) || "No Project"}
                    </div>
                    
                    {/* Website Link - with URL formatting */}
                    {user.website && (
                      <a
                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-xs flex items-center gap-1 mb-2 group"
                        onClick={(e) => e.stopPropagation()}
                        title={user.website} // Show full URL on hover
                      >
                        <span className="truncate">{formatUrl(user.website)}</span>
                        <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                      </a>
                    )}

                    {/* Status - with character limit */}
                    {user.status && (
                      <div 
                        className="text-gray-300 text-xs bg-gray-700 px-2 py-1 rounded inline-block max-w-full"
                        title={user.status} // Show full status on hover
                      >
                        <span className="truncate">{truncateText(user.status, 40)}</span>
                      </div>
                    )}
                  </div>

                  {/* Mode Badge - fixed position, won't be pushed */}
                  {user.mode && (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${modeDisplay.bg} ${modeDisplay.color} flex-shrink-0`}>
                      <span>{modeDisplay.emoji}</span>
                      <span>{user.mode}</span>
                    </div>
                  )}
                </div>

                {/* Daily Focus Time */}
                {user.dailyFocusTime !== undefined && (
                  <div className="text-xs text-blue-300 mt-2 flex items-center gap-1">
                    <span>📊</span>
                    <span>Focused: {formatTime(user.dailyFocusTime)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
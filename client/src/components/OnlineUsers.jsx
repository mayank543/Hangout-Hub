import { FaFire } from "react-icons/fa";
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

  return (
    <div className="absolute top-20 right-4 bg-black/80 text-white rounded-md p-4 border border-white/20 z-50 w-80 max-h-[80vh] overflow-y-auto backdrop-blur-xl">
      <h3 className="text-lg font-semibold mb-2">
        🟢 Online Users ({users.length})
      </h3>
      <ul className="space-y-3">
        {users.map((user) => {
          const modeDisplay = getModeDisplay(user.mode);
          return (
            <li
              key={user.id}
              className="bg-white/5 rounded p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition"
              onClick={() => useAppStore.getState().openChatWith(user)}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.avatar}
                  className="w-10 h-10 rounded-full border border-green-500"
                  alt={user.name}
                />
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-300">
                    {user.lockedInTime} locked in
                  </p>
                  {user.dailyFocusTime !== undefined && (
                    <p className="text-xs text-blue-300">
                      Focused: {formatTime(user.dailyFocusTime)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-orange-400 font-bold">
                    {user.streak}x 🔥
                  </span>
                  {/* Mode Badge */}
                  {user.mode && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${modeDisplay.bg} ${modeDisplay.color} border border-white/10`}>
                      <span className="text-[10px]">{modeDisplay.emoji}</span>
                      <span>{user.mode}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm">
                <p className="font-medium">{user.project}</p>
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline break-all"
                  >
                    {user.website}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
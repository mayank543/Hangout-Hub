// OnlineUsers.jsx
import { FaFire } from "react-icons/fa";
import useAppStore from "../store/useAppStore";

export default function OnlineUsers() {
  const users = useAppStore((state) => state.onlineUsers);
  const showOnlineUsers = useAppStore((state) => state.showOnlineUsers);

  if (!showOnlineUsers) return null;

  return (
    <div className="absolute top-20 right-4 bg-black/80 text-white rounded-md p-4 border border-white/20 z-50 w-80 max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">
        🟢 Online Users ({users.length})
      </h3>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
  key={user.id}
  className="bg-white/5 rounded p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition"
  onClick={() => useAppStore.getState().openChatWith(user)} // 👈 open chat
>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user.avatar}
                className="w-10 h-10 rounded-full border border-green-500"
                alt={user.name}
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-300">
                  {user.lockedInTime} locked in
                </p>
              </div>
              <span className="ml-auto text-orange-400 font-bold">
                {user.streak}x 🔥
              </span>
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
        ))}
      </ul>
    </div>
  );
}
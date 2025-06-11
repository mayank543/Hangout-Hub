import { useState } from "react";
import useAppStore from "../store/useAppStore";
import { socket } from "../sockets/socket";

export default function ProfileEditorModal() {
  const {
    profileEditorOpen,
    toggleProfileEditor,
    updateOnlineUserData,
    currentUserId,
  } = useAppStore();

  const [project, setProject] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = () => {
  if (!currentUserId) {
    console.warn("No current user ID set.");
    return;
  }

  // ✅ Emit to server to sync with all clients
  socket.emit("update-user-profile", {
    userId: currentUserId,
    project,
    website,
    status,
  });

  // ✅ Optional: update local UI immediately
  updateOnlineUserData(currentUserId, { project, website, status });

  toggleProfileEditor();
};

  if (!profileEditorOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Your Focus Details</h2>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Freedom Project Title"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Website URL"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Status message (e.g. 'Need help with UI')"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={toggleProfileEditor} className="px-4 py-2 bg-gray-200 rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
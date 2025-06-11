import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import { updateUserProfile } from "../sockets/socket";

export default function ProfileEditorModal() {
  const {
    profileEditorOpen,
    toggleProfileEditor,
    updateOnlineUserData,
    clearUserProfile,
    getSavedProfile,
    currentUserId,
  } = useAppStore();

  const [project, setProject] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("");

  // Load saved profile data when modal opens
  useEffect(() => {
    if (profileEditorOpen && currentUserId) {
      const savedProfile = getSavedProfile(currentUserId);
      setProject(savedProfile.project || "");
      setWebsite(savedProfile.website || "");
      setStatus(savedProfile.status || "");
    }
  }, [profileEditorOpen, currentUserId, getSavedProfile]);

  const handleSave = () => {
    if (!currentUserId) {
      console.warn("No current user ID set.");
      return;
    }

    const profileData = { project, website, status };

    // ✅ This will automatically save to localStorage and update the store
    updateOnlineUserData(currentUserId, profileData);

    // ✅ Emit to server to sync with all clients using the new function
    updateUserProfile(currentUserId, profileData);

    toggleProfileEditor();
  };

  const handleClearData = () => {
    if (!currentUserId) {
      console.warn("No current user ID set.");
      return;
    }
    
    // Clear from localStorage and store
    clearUserProfile(currentUserId);
    
    // Clear form fields
    setProject("");
    setWebsite("");
    setStatus("");
    
    // Emit to server to clear remote data
    updateUserProfile(currentUserId, {
      project: "",
      website: "",
      status: "",
    });
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
          <button 
            onClick={handleClearData} 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear Data
          </button>
          <button 
            onClick={toggleProfileEditor} 
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
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
      <div className="bg-gray-900/40 backdrop-blur-lg border border-gray-600/30 text-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-white/90">
          Edit Your Focus Details
        </h2>

        <div className="space-y-5">
          <div className="relative">
            <input
              className="w-full px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-200"
              placeholder="Freedom Project Title"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              maxLength={20}
            />
            <div className="text-xs text-white/40 mt-2 text-right">
              {project.length}/20 characters
            </div>
          </div>
          
          <div className="relative">
            <input
              className="w-full px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-200"
              placeholder="Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={40}
            />
            <div className="text-xs text-white/40 mt-2 text-right">
              {website.length}/40 characters
            </div>
          </div>
          
          <div className="relative">
            <input
              className="w-full px-4 py-3 bg-gray-800/40 backdrop-blur-sm border border-gray-600/30 rounded-xl text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-200"
              placeholder="Status message (e.g. 'Need help with UI')"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              maxLength={40}
            />
            <div className="text-xs text-white/40 mt-2 text-right">
              {status.length}/40 characters
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button 
            onClick={handleClearData} 
            className="px-5 py-2.5 bg-red-900/40 backdrop-blur-sm text-white/90 rounded-xl hover:bg-red-900/60 focus:outline-none focus:ring-1 focus:ring-red-700/50 transition-all duration-200 border border-red-700/30"
          >
            Clear Data
          </button>
          <button 
            onClick={toggleProfileEditor} 
            className="px-5 py-2.5 bg-gray-800/40 backdrop-blur-sm text-white/90 rounded-xl hover:bg-gray-800/60 focus:outline-none focus:ring-1 focus:ring-gray-600/50 transition-all duration-200 border border-gray-600/30"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-5 py-2.5 bg-blue-900/40 backdrop-blur-sm text-white/90 rounded-xl hover:bg-blue-900/60 focus:outline-none focus:ring-1 focus:ring-blue-700/50 transition-all duration-200 border border-blue-700/30"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
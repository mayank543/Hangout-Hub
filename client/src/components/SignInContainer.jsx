import { SignUpButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useAppStore from "../store/useAppStore";

const SignInContainer = () => {
  const setCurrentUserId = useAppStore((state) => state.setCurrentUserId);
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    const guestId = `guest-${uuidv4()}`;
    const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
    const guestAvatar = `https://api.dicebear.com/8.x/identicon/svg?seed=${guestName}`;

    // Save guest ID in Zustand and other info into localStorage
    setCurrentUserId(guestId);
    localStorage.setItem("guestName", guestName);
    localStorage.setItem("guestAvatar", guestAvatar);

    // No need to navigate, the app will automatically show the main interface
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/50">
      {/* Main Container */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            hangout.hub
          </h1>
          <div className="w-16 h-0.5 bg-white/60 mx-auto mb-6"></div>
          <p className="text-xl text-white/90 font-light mb-2">
            vibe. lock-in. escape together
          </p>
          <p className="text-white/70 text-sm">
            collaborate with like minds with real time chatting option
          </p>
        </div>

        {/* Sign In Options */}
        <div className="space-y-4">
          {/* Clerk Sign In Button */}
          <SignUpButton mode="modal">
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg">
              sign in with account
            </button>
          </SignUpButton>

          {/* Guest Login Button */}
          <button 
            onClick={handleGuestLogin}
            className="w-full bg-transparent hover:bg-white/10 border-2 border-white/50 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
          >
            continue as guest
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            Experience focused productivity like never before
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default SignInContainer;

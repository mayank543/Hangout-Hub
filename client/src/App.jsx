import LofiPlayer from "./components/LofiPlayer";
import Navbar from "./components/Navbar";
import TimerPanel from "./components/TimerPanel";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      <LofiPlayer />
      <Navbar />

      {/* Authenticated users only see TimerPanel */}
      <SignedIn>
        <TimerPanel />
        <div className="absolute top-4 right-4 z-10">
          <UserButton />
        </div>
      </SignedIn>

      {/* Not signed in */}
      <SignedOut>
  <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/70 text-white">
    <p className="mb-4 text-lg">Please sign in to use the timer</p>
    <SignInButton mode="modal">
      <button className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">
        Sign In
      </button>
    </SignInButton>
  </div>
</SignedOut>
    </div>
  );
}

export default App;
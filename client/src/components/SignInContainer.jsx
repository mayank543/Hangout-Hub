import { SignInButton } from "@clerk/clerk-react";

const SignInContainer = () => {
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

        {/* Sign In Button */}
        <SignInButton mode="modal">
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg">
            click here to start adventure
          </button>
        </SignInButton>

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
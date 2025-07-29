// // components/VoiceRoom.jsx
// import { useState } from "react";
// import useVoiceStore from "../store/useVoiceStore";
// import VoiceHandler from "./VoiceHandler";
// import { leaveVoiceRoom } from "../sockets/voiceSocket";
// import { useUser } from "@clerk/clerk-react";

// const VoiceRoom = () => {
//   const [roomIdInput, setRoomIdInput] = useState("");
//   const { roomId, isInVoiceRoom, joinRoom, leaveRoom } = useVoiceStore();
//   const { user } = useUser();

//   const generateRoomId = () => {
//     const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
//     joinRoom(newId);
//     setRoomIdInput(newId);
//   };

//   const handleJoin = () => {
//     if (roomIdInput.trim()) {
//       joinRoom(roomIdInput.trim());
//     }
//   };

//   const handleLeave = () => {
//     if (roomId) {
//       leaveVoiceRoom(roomId);
//     }
//     leaveRoom();
//   };

//   const copyRoomId = () => {
//     navigator.clipboard.writeText(roomId);
//     // You could add a toast notification here
//   };

//   return (
//     <div className="backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl p-5 shadow-2xl w-[90%] max-w-md mx-auto">
//       {!isInVoiceRoom ? (
//         <>
//           <h2 className="text-lg font-semibold mb-4">🎧 Voice Chat Room</h2>
          
//           <button
//             onClick={generateRoomId}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg mb-3 font-medium transition-all"
//           >
//             🔧 Create New Room
//           </button>
          
//           <div className="text-center text-white/60 text-sm mb-3">or</div>
          
//           <input
//             type="text"
//             value={roomIdInput}
//             onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
//             className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholder="Enter Room ID"
//             onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
//           />
          
//           <button
//             onClick={handleJoin}
//             disabled={!roomIdInput.trim()}
//             className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all text-white py-2 rounded-lg font-medium"
//           >
//             Join Room
//           </button>
//         </>
//       ) : (
//         <>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold">🟢 Room: {roomId}</h2>
//             <button
//               onClick={copyRoomId}
//               className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-all"
//               title="Copy Room ID"
//             >
//               📋
//             </button>
//           </div>
          
//           <button
//             onClick={handleLeave}
//             className="w-full bg-red-500 hover:bg-red-600 transition-all text-white py-2 rounded-lg mb-4 font-medium"
//           >
//             🚪 Leave Room
//           </button>
          
//           {/* Debug button - remove this in production */}
//           <button
//             onClick={() => {
//               console.log("🐛 DEBUG INFO:");
//               console.log("Current user:", user);
//               console.log("User ID:", user?.id);
//               console.log("Room ID:", roomId);
//               console.log("Is in voice room:", isInVoiceRoom);
//             }}
//             className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-1 rounded text-xs mb-2"
//           >
//             🐛 Debug Info
//           </button>
          
//           <VoiceHandler />
//         </>
//       )}
//     </div>
//   );
// };

// export default VoiceRoom;
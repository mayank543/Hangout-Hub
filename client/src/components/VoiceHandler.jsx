// // components/VoiceHandler.jsx - Debug Version
// import { useEffect, useRef, useState } from "react";
// import Peer from "simple-peer";
// import voiceSocket, { connectVoiceSocket } from "../sockets/voiceSocket";
// import useVoiceStore from "../store/useVoiceStore";
// import { useUser } from "@clerk/clerk-react";

// const VoiceHandler = () => {
//   const { roomId, isInVoiceRoom } = useVoiceStore();
//   const { user } = useUser();
  
//   const [peers, setPeers] = useState([]);
//   const [allUsersInRoom, setAllUsersInRoom] = useState([]);
//   const [debugLogs, setDebugLogs] = useState([]);
//   const userStream = useRef();
//   const peersRef = useRef({});

//   // Get a consistent user ID
//   const userId = user?.id || user?.primaryEmailAddress?.emailAddress || 'anonymous';
//   const displayName = user?.firstName || user?.fullName || userId;
  
//   // Debug logging function
//   const addDebugLog = (message) => {
//     const timestamp = new Date().toLocaleTimeString();
//     console.log(`[${timestamp}] ${message}`);
//     setDebugLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
//   };

//   useEffect(() => {
//     addDebugLog(`🔄 Effect triggered - roomId: ${roomId}, isInVoiceRoom: ${isInVoiceRoom}, user: ${!!user}`);
    
//     if (!isInVoiceRoom || !roomId || !user) {
//       addDebugLog("❌ Early return - missing requirements");
//       return;
//     }

//     addDebugLog(`🎯 Starting voice room setup - userId: ${userId}, roomId: ${roomId}`);

//     // Step 1: Get mic
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       addDebugLog("🎤 Microphone access granted");
//       userStream.current = stream;
      
//       // Connect to voice socket
//       addDebugLog("🔗 Connecting to voice socket...");
//       connectVoiceSocket(userId, roomId);

//       // Add socket event listeners with debug logging
//       voiceSocket.on("connect", () => {
//         addDebugLog("✅ Voice socket connected");
//       });

//       voiceSocket.on("disconnect", () => {
//         addDebugLog("❌ Voice socket disconnected");
//       });

//       // Request initial user list
//       addDebugLog("📋 Requesting initial room users...");
//       voiceSocket.emit("get-room-users", { roomId });

//       // Step 2: Listen to other users (for WebRTC peer setup)
//       voiceSocket.on("all-users", (users) => {
//         addDebugLog(`📥 Received all-users: ${JSON.stringify(users)}`);
//         const newPeers = [];

//         users.forEach(({ id: socketId, userId }) => {
//           const peer = createPeer(socketId, voiceSocket.id, stream);
//           peersRef.current[socketId] = {
//             peer,
//             userId,
//             socketId
//           };
//           newPeers.push({
//             peer,
//             userId,
//             socketId
//           });
//         });

//         setPeers(newPeers);
//         addDebugLog(`🔗 Created ${newPeers.length} peer connections`);
//       });

//       // 🔥 Listen for room user updates (shows all users to everyone)
//       voiceSocket.on("room-users-updated", (allUsers) => {
//         addDebugLog(`🔄 Room users updated: ${JSON.stringify(allUsers)}`);
//         setAllUsersInRoom(allUsers);
//       });

//       voiceSocket.on("user-joined", ({ signal, callerId, userId }) => {
//         addDebugLog(`👋 User joined - callerId: ${callerId}, userId: ${userId}`);
//         const peer = addPeer(signal, callerId, stream);
        
//         peersRef.current[callerId] = {
//           peer,
//           userId: userId || "Unknown",
//           socketId: callerId
//         };
        
//         setPeers((prev) => [...prev, {
//           peer,
//           userId: userId || "Unknown",
//           socketId: callerId
//         }]);
//       });

//       voiceSocket.on("receiving-returned-signal", ({ id, signal }) => {
//         addDebugLog(`📡 Received returned signal from: ${id}`);
//         const peerData = peersRef.current[id];
//         if (peerData) {
//           peerData.peer.signal(signal);
//         }
//       });

//       // Handle user disconnect
//       voiceSocket.on("user-disconnected", (socketId) => {
//         addDebugLog(`👋 User disconnected: ${socketId}`);
        
//         // Remove peer
//         if (peersRef.current[socketId]) {
//           peersRef.current[socketId].peer.destroy();
//           delete peersRef.current[socketId];
//         }
        
//         // Update peers state
//         setPeers((prev) => prev.filter(p => p.socketId !== socketId));
//       });

//       // Add a timeout to check connection after a few seconds
//       setTimeout(() => {
//         addDebugLog(`⏰ Connection check - Connected: ${voiceSocket.connected}, Room users: ${allUsersInRoom.length}`);
//       }, 3000);

//     }).catch((error) => {
//       addDebugLog(`❌ Microphone error: ${error.message}`);
//       console.error("Error accessing microphone:", error);
//       alert("Could not access microphone. Please check permissions.");
//     });

//     return () => {
//       addDebugLog("🧹 Cleaning up voice handler...");
      
//       // Cleanup
//       if (userStream.current) {
//         userStream.current.getTracks().forEach(track => track.stop());
//       }
      
//       // Destroy all peers
//       Object.values(peersRef.current).forEach(({ peer }) => {
//         if (peer) peer.destroy();
//       });
      
//       peersRef.current = {};
//       setPeers([]);
//       setAllUsersInRoom([]);
      
//       // Remove all event listeners
//       voiceSocket.off("connect");
//       voiceSocket.off("disconnect");
//       voiceSocket.off("all-users");
//       voiceSocket.off("room-users-updated");
//       voiceSocket.off("user-joined");
//       voiceSocket.off("receiving-returned-signal");
//       voiceSocket.off("user-disconnected");
      
//       if (voiceSocket.connected) {
//         voiceSocket.disconnect();
//       }
//     };
//   }, [roomId, isInVoiceRoom, user, userId]);

//   return (
//     <div>
//       {/* Debug Logs */}
//       <div className="mb-4 p-3 bg-red-900/20 rounded-lg">
//         <h3 className="font-semibold mb-2 text-red-300">🐛 Debug Logs:</h3>
//         <div className="text-xs text-red-200 space-y-1 max-h-40 overflow-y-auto">
//           {debugLogs.map((log, index) => (
//             <div key={index} className="font-mono">{log}</div>
//           ))}
//         </div>
//         <div className="mt-2 text-xs text-red-300">
//           Socket Connected: {voiceSocket.connected ? '✅' : '❌'} | 
//           Room ID: {roomId} | 
//           User ID: {userId}
//         </div>
//       </div>

//       {/* Connected Users Display */}
//       <div className="mb-4 p-3 bg-white/10 rounded-lg">
//         <h3 className="font-semibold mb-2 text-white">🧑‍🤝‍🧑 Connected Users:</h3>
//         {allUsersInRoom.length === 0 ? (
//           <p className="text-yellow-400 text-sm">⚠️ No users detected in room</p>
//         ) : (
//           <ul className="space-y-1 text-sm">
//             {allUsersInRoom.map((userInRoom) => (
//               <li 
//                 key={userInRoom.userId} 
//                 className={`${
//                   userInRoom.userId === userId 
//                     ? 'text-green-400 font-medium' 
//                     : 'text-white/80'
//                 }`}
//               >
//                 {userInRoom.userId === userId ? (
//                   <>🟢 You ({displayName})</>
//                 ) : (
//                   <>🟡 {userInRoom.userId}</>
//                 )}
//               </li>
//             ))}
//           </ul>
//         )}
//         <p className="text-xs text-white/60 mt-2">
//           Total: {allUsersInRoom.length} user(s) in room
//         </p>
//       </div>

//       {/* Manual Test Buttons */}
//       <div className="mb-4 space-y-2">
//         <button 
//           onClick={() => {
//             addDebugLog("🔄 Manual: Requesting room users...");
//             voiceSocket.emit("get-room-users", { roomId });
//           }}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
//         >
//           🔄 Refresh Room Users
//         </button>
        
//         <button 
//           onClick={() => {
//             addDebugLog("🔄 Manual: Rejoining room...");
//             if (voiceSocket.connected) {
//               voiceSocket.emit("join-voice-room", { userId, roomId });
//             } else {
//               connectVoiceSocket(userId, roomId);
//             }
//           }}
//           className="w-full bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
//         >
//           🔄 Rejoin Room
//         </button>
//       </div>

//       {/* Audio Players */}
//       <div className="space-y-2">
//         {peers.map((peerData) => (
//           <AudioPlayer 
//             key={peerData.socketId} 
//             peer={peerData.peer} 
//             userId={peerData.userId}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const createPeer = (userToSignal, callerId, stream) => {
//   const peer = new Peer({ initiator: true, trickle: false, stream });

//   peer.on("signal", (signal) => {
//     voiceSocket.emit("sending-signal", {
//       userToSignal,
//       callerId,
//       signal,
//     });
//   });

//   return peer;
// };

// const addPeer = (incomingSignal, callerId, stream) => {
//   const peer = new Peer({ initiator: false, trickle: false, stream });

//   peer.on("signal", (signal) => {
//     voiceSocket.emit("returning-signal", { signal, callerId });
//   });

//   peer.signal(incomingSignal);
//   return peer;
// };

// const AudioPlayer = ({ peer, userId }) => {
//   const ref = useRef();
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     peer.on("stream", (stream) => {
//       ref.current.srcObject = stream;
//       setIsPlaying(true);
//     });

//     peer.on("close", () => {
//       setIsPlaying(false);
//     });

//     return () => {
//       if (ref.current) {
//         ref.current.srcObject = null;
//       }
//     };
//   }, [peer]);

//   return (
//     <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
//       <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-400'}`} />
//       <span className="text-sm text-white/80">
//         {isPlaying ? '🔊' : '🔇'} {userId}
//       </span>
//       <audio ref={ref} autoPlay playsInline className="hidden" />
//     </div>
//   );
// };

// export default VoiceHandler;
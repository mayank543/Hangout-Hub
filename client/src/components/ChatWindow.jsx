// import { useEffect, useRef, useState } from 'react';
// import useChatStore from '../store/useChatStore';
// import { useUser } from '@clerk/clerk-react';
// import socket from '../sockets/socket';

// export default function ChatWindow() {
//   const { activeChatUser, messages, addMessage } = useChatStore();
//   const { user } = useUser();
//   const [input, setInput] = useState('');
//   const bottomRef = useRef();

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const msg = { from: user.id, to: activeChatUser.id, text: input };
//     socket.emit('private-message', msg);
//     addMessage(activeChatUser.id, msg);
//     setInput('');
//   };

//   useEffect(() => {
//     socket.on('private-message', (msg) => {
//       addMessage(msg.from, msg);
//     });
//     return () => {
//       socket.off('private-message');
//     };
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const chat = messages[activeChatUser?.id] || [];

//   if (!activeChatUser) return null;

//   return (
//     <div className="fixed bottom-0 right-4 w-80 h-96 bg-black/90 backdrop-blur-md text-white rounded-lg p-4 flex flex-col z-50">
//       <div className="font-bold mb-2">Chat with {activeChatUser.name}</div>
//       <div className="flex-1 overflow-y-auto space-y-2 text-sm">
//         {chat.map((m, i) => (
//           <div key={i} className={`p-2 rounded ${m.from === user.id ? 'bg-green-600 self-end' : 'bg-gray-700 self-start'}`}>
//             {m.text}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//       <div className="flex mt-2">
//         <input
//           className="flex-1 bg-black/50 border border-gray-600 rounded-l px-2 py-1 text-white"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage} className="bg-green-700 px-4 py-1 rounded-r">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
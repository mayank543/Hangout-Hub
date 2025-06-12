import { useEffect, useState, useRef } from "react";
import useAppStore from "../store/useAppStore";
import { socket } from "../sockets/socket";

export default function ChatBox() {
  const selectedUser = useAppStore((state) => state.selectedUser);
  const closeChat = useAppStore((state) => state.closeChat);
  const currentUserId = useAppStore((state) => state.currentUserId);
  const onlineUsers = useAppStore((state) => state.onlineUsers);
  
  const [messagesMap, setMessagesMap] = useState({});
  const messages = selectedUser ? messagesMap[selectedUser.id] || [] : [];
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleIncomingMessage = ({ message, fromUser }) => {
      console.log("📥 Received message:", message, "from", fromUser.name);

      setMessagesMap((prev) => {
        const prevMessages = prev[fromUser.id] || [];
        return {
          ...prev,
          [fromUser.id]: [
            ...prevMessages,
            {
              from: "them",
              text: message,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        };
      });
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = input.trim();
    const toUserId = selectedUser?.id;
    
    if (!toUserId || !currentUserId) {
      console.log("❌ Missing user IDs:", { toUserId, currentUserId });
      return;
    }

    const currentUser = onlineUsers.find(user => user.id === currentUserId);
    const senderName = currentUser?.name || "Me";

    socket.emit("private-message", {
      toUserId,
      message,
      fromUser: {
        id: currentUserId,
        name: senderName,
      },
    });

    console.log(`💬 Sending message to userId: ${toUserId} from ${senderName}`);

    setMessagesMap((prev) => {
      const prevMessages = prev[selectedUser.id] || [];
      return {
        ...prev,
        [selectedUser.id]: [
          ...prevMessages,
          {
            from: "me",
            text: message,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      };
    });

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="fixed bottom-6 right-6 w-50 z-[70]">
      {/* Glass morphism container */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500/20 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                {selectedUser.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{selectedUser.name}</p>
                <p className="text-xs text-green-300">● Online</p>
              </div>
            </div>
            <button 
              onClick={closeChat} 
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="h-64 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {messages.map((msg, i) => {
            const isMe = msg.from === "me";
            return (
              <div
                key={i}
                className={`flex items-end gap-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  isMe 
                    ? "bg-green-500 text-white" 
                    : "bg-blue-500 text-white"
                }`}>
                  {isMe ? "M" : selectedUser.name[0]?.toUpperCase()}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`px-3 py-1.5 rounded-2xl backdrop-blur-sm border ${
                      isMe
                        ? "bg-green-200/20 border-green-300/20 text-white rounded-br-md"
                        : "bg-blue-200/20 border-blue-300/20 text-white rounded-bl-md"
                    } shadow-lg`}
                  >
                    <div className="text-xs break-words">{msg.text}</div>
                  </div>
                  <div className={`text-[10px] text-white/50 mt-1 px-2 ${isMe ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-white/10 p-4 bg-white/5">
          <div className="flex gap-3">
            <input
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 outline-none focus:border-blue-400/50 focus:bg-white/15 transition-all duration-200"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
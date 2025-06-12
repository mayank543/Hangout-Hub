import { useEffect, useState, useRef } from "react";
import useAppStore from "../store/useAppStore";
import { socket } from "../sockets/socket";

export default function ChatBox() {
  const selectedUser = useAppStore((state) => state.selectedUser);
  const closeChat = useAppStore((state) => state.closeChat);
  const currentUserId = useAppStore((state) => state.currentUserId); // 🔥 Get current user ID
  const onlineUsers = useAppStore((state) => state.onlineUsers); // 🔥 Get online users for sender info
  
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
    
    // 🔥 KEY FIX: Use userId instead of socketId
    const toUserId = selectedUser?.id;
    
    if (!toUserId || !currentUserId) {
      console.log("❌ Missing user IDs:", { toUserId, currentUserId });
      return;
    }

    // 🔥 FIXED: Get current user info for better message context
    const currentUser = onlineUsers.find(user => user.id === currentUserId);
    const senderName = currentUser?.name || "Me";

    socket.emit("private-message", {
      toUserId, // 🔥 Send to userId instead of socketId
      message,
      fromUser: {
        id: currentUserId, // 🔥 Use actual user ID instead of socket ID
        name: senderName,
      },
    });

    console.log(`💬 Sending message to userId: ${toUserId} from ${senderName}`);

    // Add message to local state
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
    <div className="fixed bottom-4 right-4 bg-black text-white border border-white/10 p-4 rounded w-80 z-50 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold">{selectedUser.name}</p>
        <button onClick={closeChat} className="text-red-400">✖</button>
      </div>

      <div className="max-h-60 overflow-y-auto mb-2 space-y-1">
        {messages.map((msg, i) => {
          const isMe = msg.from === "me";
          return (
            <div
              key={i}
              className={`flex items-end mb-1 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs mr-2">
                  {selectedUser.name[0]?.toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-[70%] px-3 py-2 rounded-xl text-sm break-words ${
                  isMe
                    ? "bg-green-700 text-white rounded-br-none"
                    : "bg-white/10 text-white rounded-bl-none"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {msg.time}
                </div>
              </div>

              {isMe && (
                <div className="w-8 h-8 rounded-full bg-green-800 text-xs flex items-center justify-center ml-2">
                  M
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-white/10 p-2 rounded text-sm text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
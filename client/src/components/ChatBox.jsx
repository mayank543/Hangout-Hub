import { useEffect, useState, useRef } from "react";
import useAppStore from "../store/useAppStore";
import { socket } from "../sockets/socket";

export default function ChatBox() {
  const selectedUser = useAppStore((state) => state.selectedUser);
  const closeChat = useAppStore((state) => state.closeChat);
  const [messagesMap, setMessagesMap] = useState({});
const messages = selectedUser ? messagesMap[selectedUser.socketId] || [] : [];
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
  const handleIncomingMessage = ({ message, fromUser }) => {
    console.log("📥 Received message:", message, "from", fromUser.name);

    setMessagesMap((prev) => {
      const prevMessages = prev[fromUser.socketId] || [];
      return {
        ...prev,
        [fromUser.socketId]: [...prevMessages, { from: "them", text: message }],
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
  const toSocketId = selectedUser?.socketId;

  if (!toSocketId) return;

  socket.emit("private-message", {
    toSocketId,
    message,
    fromUser: {
      id: socket.id,
      name: "Me",
    },
  });

  setMessagesMap((prev) => {
    const prevMessages = prev[toSocketId] || [];
    return {
      ...prev,
      [toSocketId]: [...prevMessages, { from: "me", text: message }],
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
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm px-2 py-1 rounded ${
              msg.from === "them"
                ? "bg-white/10 text-left"
                : "bg-green-700 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
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
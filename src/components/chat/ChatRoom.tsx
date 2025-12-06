"use client";

import { useWebSocketChat } from "@/hooks/useWebSocketChat";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./ChatRoom/ChatHeader";
import { ChatInput } from "./ChatRoom/ChatInput";
import { ChatMessages } from "./ChatRoom/ChatMessages";
import { useChatTyping } from "./ChatRoom/useChatTyping";

interface ChatRoomProps {
  roomId: string;
  roomName?: string;
  className?: string;
}

export function ChatRoom({ roomId, roomName, className = "" }: ChatRoomProps) {
  const { isAuthenticated } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // console.log("🔄 ChatRoom render:", { roomId, isAuthenticated });

  const {
    messages,
    isConnected,
    isConnecting,
    error,
    sendMessage,
    sendTyping,
    connect,
    typingUsers,
  } = useWebSocketChat({
    roomId,
    autoConnect: isAuthenticated,
  });

  const { handleTyping, stopTyping } = useChatTyping(
    isTyping,
    setIsTyping,
    sendTyping
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage.trim());
    setInputMessage("");
    stopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}
    >
      <ChatHeader
        roomName={roomName}
        roomId={roomId}
        isConnected={isConnected}
        isConnecting={isConnecting}
        onReconnect={connect}
      />

      {error && (
        <div className="px-4 py-2 m-2 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      <ChatMessages
        messages={messages}
        typingUsers={typingUsers}
        messagesEndRef={messagesEndRef}
      />
      <p> COUCOU </p>
      <ChatInput
        inputMessage={inputMessage}
        isConnected={isConnected}
        onInputChange={handleInputChange}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}

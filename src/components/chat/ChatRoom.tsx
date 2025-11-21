"use client";

// Composant principal de la salle de chat temps réel

import { useWebSocketChat } from "@/hooks/useWebSocketChat";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
import { ChatMessageComponent } from "./ChatMessage";

interface ChatRoomProps {
  roomId: string;
  roomName?: string;
  className?: string;
}

export function ChatRoom({ roomId, roomName, className = "" }: ChatRoomProps) {
  const { isAuthenticated } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Scroll automatique vers le bas quand un nouveau message arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gestion de l'indicateur de frappe
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1000);
  };

  // Gestion de l'envoi de message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    sendMessage(inputMessage.trim());
    setInputMessage("");

    if (isTyping) {
      setIsTyping(false);
      sendTyping(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Gestion du changement dans l'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Vous devez être connecté pour accéder au chat
          </p>
          <a
            href="/auth/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {roomName || `Salon ${roomId}`}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-sm">
                {isConnecting
                  ? "Connexion..."
                  : isConnected
                  ? "En ligne"
                  : "Déconnecté"}
              </span>
            </div>
          </div>
          {!isConnected && !isConnecting && (
            <button
              onClick={connect}
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
            >
              Reconnecter
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 m-2 rounded">
          {error}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Aucun message. Soyez le premier à écrire !</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessageComponent key={message.id || index} message={message} />
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="flex items-center text-gray-500 text-sm italic ml-2">
            <div className="flex space-x-1 mr-2">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            {typingUsers.size === 1
              ? "Quelqu'un écrit..."
              : `${typingUsers.size} personnes écrivent...`}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder={
              isConnected ? "Tapez votre message..." : "Connexion en cours..."
            }
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

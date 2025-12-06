// Composant pour afficher un message individuel de chat

import { useAuth } from "@/providers/AuthProvider";
import { ChatMessage } from "@/services/webSocketChatService";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isOwnMessage = message.user_id === user?.id;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Messages système (user_joined, user_left)
  if (message.type === "user_joined" || message.type === "user_left") {
    return (
      <div className="flex justify-center my-2">
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {message.type === "user_joined" ? "👋" : "👋"}{" "}
          <span className="font-semibold">
            {message.username || "Quelqu'un"}
          </span>{" "}
          {message.type === "user_joined"
            ? "a rejoint le chat"
            : "a quitté le chat"}
        </div>
      </div>
    );
  }

  // Messages de chat normaux
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {!isOwnMessage && (message.username || message.user_name) && (
            <div className="text-xs font-semibold mb-1 opacity-75">
              {message.username || message.user_name}
            </div>
          )}
          <p className="text-sm break-words">{message.message}</p>
          {(message.timestamp || message.createdAt) && (
            <div
              className={`text-xs mt-1 ${
                isOwnMessage ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp || message.createdAt)}
            </div>
          )}
        </div>
      </div>

      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold mr-2 order-0">
          {(message.username || message.user_name)?.charAt(0).toUpperCase() ||
            "?"}
        </div>
      )}

      {isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ml-2 order-3">
          {user?.username?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase() ||
            "M"}
        </div>
      )}
    </div>
  );
}

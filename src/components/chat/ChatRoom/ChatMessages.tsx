import { ChatMessage } from "@/services/webSocketChatService";
import { ChatMessageComponent } from "../ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessage[];
  typingUsers: Set<string>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  typingUsers,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Aucun message. Soyez le premier à écrire !</p>
        </div>
      ) : (
        messages
          .filter(
            (msg) =>
              msg.type === "chat_message" ||
              msg.type === "user_joined" ||
              msg.type === "user_left"
          )
          .map((message, index) => (
            <ChatMessageComponent key={message.id || index} message={message} />
          ))
      )}

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
  );
}

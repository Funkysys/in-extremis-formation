/**
 * Gestion des messages et typing indicators
 * Responsabilité : State management messages uniquement
 */

import type { ChatMessage } from "@/services/webSocketChatService";
import { useCallback, useRef, useState } from "react";

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addMessage = useCallback((message: ChatMessage) => {
    console.log(`💬 Ajout message:`, message);
    setMessages((prev) => {
      const newMessages = [...prev, message];
      console.log(`📝 Total messages:`, newMessages.length);
      return newMessages;
    });
  }, []);

  const handleTypingStart = useCallback((userId: string) => {
    if (!userId) return;

    setTypingUsers((prev) => new Set(prev).add(userId));

    const existingTimeout = typingTimeoutRef.current.get(userId);
    if (existingTimeout) clearTimeout(existingTimeout);

    const timeout = setTimeout(() => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }, 3000);

    typingTimeoutRef.current.set(userId, timeout);
  }, []);

  const handleTypingStop = useCallback((userId: string) => {
    if (!userId) return;

    setTypingUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });

    const existingTimeout = typingTimeoutRef.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      typingTimeoutRef.current.delete(userId);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const cleanup = useCallback(() => {
    typingTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    typingTimeoutRef.current.clear();
  }, []);

  return {
    messages,
    typingUsers,
    addMessage,
    handleTypingStart,
    handleTypingStop,
    clearMessages,
    cleanup,
  };
}

// Hook personnalisé pour utiliser le WebSocket chat
// Gère la connexion, les messages, et l'état

import { useAuth } from "@/providers/AuthProvider";
import {
  ChatMessage,
  WebSocketChatService,
} from "@/services/webSocketChatService";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebSocketChatOptions {
  roomId: string;
  autoConnect?: boolean;
  wsUrl?: string;
}

interface UseWebSocketChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendMessage: (message: string) => void;
  sendTyping: (isTyping: boolean) => void;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
  typingUsers: Set<string>;
}

export function useWebSocketChat({
  roomId,
  autoConnect = true,
  wsUrl,
}: UseWebSocketChatOptions): UseWebSocketChatReturn {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const wsServiceRef = useRef<WebSocketChatService | null>(null);
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Construction de l'URL WebSocket
  const websocketUrl =
    wsUrl ||
    `${
      process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8000"
    }/chat/ws/${roomId}`;

  // Gestion de l'arrivée d'un nouveau message
  const handleMessage = useCallback((message: ChatMessage) => {
    if (message.type === "typing_start" && message.user_id) {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.add(message.user_id);
        return next;
      });

      // Retirer l'indicateur après 3 secondes
      const existingTimeout = typingTimeoutRef.current.get(message.user_id);
      if (existingTimeout) clearTimeout(existingTimeout);

      const timeout = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(message.user_id);
          return next;
        });
      }, 3000);

      typingTimeoutRef.current.set(message.user_id, timeout);
    } else if (message.type === "typing_stop" && message.user_id) {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(message.user_id);
        return next;
      });

      const existingTimeout = typingTimeoutRef.current.get(message.user_id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        typingTimeoutRef.current.delete(message.user_id);
      }
    } else if (message.type === "message") {
      setMessages((prev) => [...prev, message]);
    }
  }, []);

  // Connexion au WebSocket
  const connect = useCallback(() => {
    if (wsServiceRef.current?.isConnected()) {
      console.log("WebSocket already connected");
      return;
    }

    setIsConnecting(true);
    setError(null);

    wsServiceRef.current = new WebSocketChatService({
      url: websocketUrl,
      roomId,
      token: token || undefined,
      onMessage: handleMessage,
      onConnect: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      },
      onDisconnect: () => {
        setIsConnected(false);
        setIsConnecting(false);
      },
      onError: (error) => {
        setError("Erreur de connexion WebSocket");
        setIsConnecting(false);
        console.error("WebSocket error:", error);
      },
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
    });

    wsServiceRef.current.connect();
  }, [websocketUrl, roomId, token, handleMessage]);

  // Déconnexion du WebSocket
  const disconnect = useCallback(() => {
    wsServiceRef.current?.disconnect();
    wsServiceRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Envoyer un message
  const sendMessage = useCallback((message: string) => {
    if (!wsServiceRef.current?.isConnected()) {
      setError("Non connecté au chat");
      return;
    }

    wsServiceRef.current.sendMessage(message);
  }, []);

  // Envoyer un indicateur de frappe
  const sendTyping = useCallback((isTyping: boolean) => {
    if (!wsServiceRef.current?.isConnected()) return;
    wsServiceRef.current.sendTyping(isTyping);
  }, []);

  // Vider les messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Connexion automatique au montage
  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, token, connect, disconnect]);

  // Nettoyage des timeouts de typing
  useEffect(() => {
    const timeouts = typingTimeoutRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  return {
    messages,
    isConnected,
    isConnecting,
    error,
    sendMessage,
    sendTyping,
    connect,
    disconnect,
    clearMessages,
    typingUsers,
  };
}

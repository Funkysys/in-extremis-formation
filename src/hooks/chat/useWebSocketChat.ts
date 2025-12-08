/**
 * Hook WebSocket Chat
 * Responsabilité : Orchestration uniquement
 */

import { useAuth } from "@/providers/AuthProvider";
import {
  ChatMessage,
  WebSocketChatService,
} from "@/services/webSocketChatService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChatMessages } from "./useChatMessages";

interface UseWebSocketChatOptions {
  roomId: string;
  autoConnect?: boolean;
  wsUrl?: string;
}

export function useWebSocketChat({
  roomId,
  autoConnect = true,
  wsUrl,
}: UseWebSocketChatOptions) {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsServiceRef = useRef<WebSocketChatService | null>(null);
  const hasConnectedRef = useRef(false);
  const mountCountRef = useRef(0);
  const lastConnectTimeRef = useRef(0);

  const chatMessages = useChatMessages();
  const chatMessagesRef = useRef(chatMessages);

  // Mettre à jour la ref sans déclencher de re-render
  chatMessagesRef.current = chatMessages;

  const websocketUrl =
    wsUrl ||
    `${
      process.env.NEXT_PUBLIC_WS_ENDPOINT || "ws://localhost:8000"
    }/chat/ws/room/${roomId}`;

  const handleMessage = useCallback((message: ChatMessage) => {
    const userId = String(message.user_id || "");

    switch (message.type) {
      case "room_joined":
        console.log(`✅ Connecté à la room ${message.room_id}`);
        break;

      case "chat_message":
      case "user_joined":
      case "user_left":
      case "moderation_action":
        chatMessagesRef.current.addMessage(message);
        break;

      case "typing_start":
        chatMessagesRef.current.handleTypingStart(userId);
        break;

      case "typing_stop":
        chatMessagesRef.current.handleTypingStop(userId);
        break;

      case "error":
        console.error("❌ Erreur WebSocket:", message.message);
        setError(message.message || "Erreur inconnue");
        break;

      default:
        console.warn("Type de message inconnu:", message.type);
    }
  }, []);

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

  const disconnect = useCallback(() => {
    wsServiceRef.current?.disconnect();
    wsServiceRef.current = null;
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!wsServiceRef.current?.isConnected()) {
      setError("Non connecté au chat");
      return;
    }
    wsServiceRef.current.sendMessage(message);
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!wsServiceRef.current?.isConnected()) return;
    wsServiceRef.current.sendTyping(isTyping);
  }, []);

  useEffect(() => {
    mountCountRef.current += 1;
    const currentMount = mountCountRef.current;
    console.log("🎬 useWebSocketChat MOUNT #" + currentMount + ":", {
      roomId,
      autoConnect,
      hasToken: !!token,
    });

    // Protection contre les reconnexions trop rapides (< 1 seconde)
    const now = Date.now();
    const timeSinceLastConnect = now - lastConnectTimeRef.current;

    if (autoConnect && token && !hasConnectedRef.current) {
      if (timeSinceLastConnect >= 1000) {
        console.log(
          "🔌 Connexion WebSocket avec token:",
          token?.substring(0, 20) + "..."
        );
        hasConnectedRef.current = true;
        lastConnectTimeRef.current = now;
        connect();
      } else {
        console.warn(
          "⚠️ Reconnexion trop rapide, ignorée:",
          timeSinceLastConnect + "ms"
        );
      }
    }

    return () => {
      console.log("🗑️ useWebSocketChat UNMOUNT #" + currentMount + ":", {
        roomId,
      });

      // En mode développement React Strict Mode, le composant monte/démonte/remonte
      // On ne déconnecte PAS immédiatement pour éviter les reconnexions inutiles
      // On garde juste la connexion active et on nettoie hasConnectedRef pour permettre une reconnexion si besoin
      hasConnectedRef.current = false;

      // Note: On ne déconnecte PAS le WebSocket ici car si c'est un remount,
      // le prochain mount réutilisera la connexion existante
      // Le WebSocket sera déconnecté uniquement quand la page change vraiment
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    messages: chatMessages.messages,
    isConnected,
    isConnecting,
    error,
    sendMessage,
    sendTyping,
    connect,
    disconnect,
    clearMessages: chatMessages.clearMessages,
    typingUsers: chatMessages.typingUsers,
  };
}

/**
 * Types pour le service WebSocket Chat
 */

export interface ChatMessage {
  id?: string | number;
  room_id?: string | number;
  user_id?: string | number;
  user_name?: string;
  username?: string;
  role?: string;
  message?: string;
  timestamp?: string;
  createdAt?: string;
  type:
    | "room_joined"
    | "chat_message"
    | "user_joined"
    | "user_left"
    | "typing_start"
    | "typing_stop"
    | "moderation_action"
    | "error";
  connection_count?: number;
  action?: "ban" | "mute";
  target_user_id?: number;
  moderator_user_id?: number;
  duration_minutes?: number;
}

export interface WebSocketConfig {
  url: string;
  roomId: string;
  token?: string;
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

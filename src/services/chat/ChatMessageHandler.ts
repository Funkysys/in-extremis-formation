/**
 * Gestionnaire de messages WebSocket
 * Responsabilité : Envoi et parsing messages uniquement
 */

import type { ChatMessage } from "./types";

export class ChatMessageHandler {
  private roomId: string;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  parseMessage(data: string): ChatMessage | null {
    try {
      const rawMessage = JSON.parse(data);
      console.log("📨 Message reçu:", rawMessage);

      const message: ChatMessage = {
        type: rawMessage.type,
        ...rawMessage.data,
        room_id: rawMessage.data.room_id || this.roomId,
      };

      this.logMessage(message);
      return message;
    } catch (error) {
      console.error("Failed to parse message:", error);
      return null;
    }
  }

  private logMessage(message: ChatMessage): void {
    switch (message.type) {
      case "room_joined":
        console.log(
          `🚪 Room ${message.room_id}, participants: ${message.connection_count}`
        );
        break;
      case "chat_message":
        console.log(`💬 ${message.username}: ${message.message}`);
        break;
      case "user_joined":
        console.log(`👋 ${message.username} a rejoint`);
        break;
      case "user_left":
        console.log(`👋 ${message.username} a quitté`);
        break;
      case "error":
        console.error("❌ Erreur:", message.message);
        break;
    }
  }

  sendMessage(ws: WebSocket, message: string): boolean {
    if (ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return false;
    }

    if (!message || message.trim().length === 0) {
      console.error("Message cannot be empty");
      return false;
    }

    if (message.length > 1000) {
      console.error("Message too long (max 1000)");
      return false;
    }

    ws.send(
      JSON.stringify({
        type: "chat_message",
        data: { message: message.trim() },
      })
    );
    return true;
  }

  sendTyping(ws: WebSocket, isTyping: boolean): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: isTyping ? "typing_start" : "typing_stop",
          data: {},
        })
      );
    }
  }

  sendModeration(
    ws: WebSocket,
    action: "ban" | "mute",
    targetUserId: number,
    durationMinutes: number = 0
  ): void {
    if (ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    ws.send(
      JSON.stringify({
        type: "moderation_action",
        data: {
          action,
          target_user_id: targetUserId,
          duration_minutes: durationMinutes,
        },
      })
    );
  }
}

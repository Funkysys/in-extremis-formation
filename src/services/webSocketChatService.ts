/**
 * Service WebSocket pour le chat temps réel
 * Responsabilité : Orchestration uniquement
 */

export type { ChatMessage, WebSocketConfig } from "./chat/types";

import { ChatConnectionManager } from "./chat/ChatConnectionManager";
import { ChatMessageHandler } from "./chat/ChatMessageHandler";
import type { WebSocketConfig } from "./chat/types";

export class WebSocketChatService {
  private connectionManager: ChatConnectionManager;
  private messageHandler: ChatMessageHandler;
  private config: WebSocketConfig;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = config;
    this.connectionManager = new ChatConnectionManager(config);
    this.messageHandler = new ChatMessageHandler(config.roomId);
  }

  connect(): void {
    this.connectionManager.connect((ws) => {
      this.setupEventListeners(ws);
    });
  }

  private setupEventListeners(ws: WebSocket): void {
    ws.onopen = () => {
      console.log(`✅ Connected to room: ${this.config.roomId}`);
      this.connectionManager.resetReconnectAttempts();
      this.config.onConnect?.();
      this.startHeartbeat();
    };

    ws.onmessage = (event) => {
      const message = this.messageHandler.parseMessage(event.data);
      if (message) {
        this.config.onMessage?.(message);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.config.onError?.(error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code);
      this.stopHeartbeat();
      this.config.onDisconnect?.();
    };
  }

  sendMessage(message: string): void {
    const ws = this.connectionManager.getWebSocket();
    if (ws) {
      this.messageHandler.sendMessage(ws, message);
    }
  }

  sendTyping(isTyping: boolean): void {
    const ws = this.connectionManager.getWebSocket();
    if (ws) {
      this.messageHandler.sendTyping(ws, isTyping);
    }
  }

  sendModerationAction(
    action: "ban" | "mute",
    targetUserId: number,
    durationMinutes: number = 0
  ): void {
    const ws = this.connectionManager.getWebSocket();
    if (ws) {
      this.messageHandler.sendModeration(
        ws,
        action,
        targetUserId,
        durationMinutes
      );
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const ws = this.connectionManager.getWebSocket();
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping", data: {} }));
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    this.connectionManager.disconnect();
  }

  isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

  getReadyState(): number | null {
    const ws = this.connectionManager.getWebSocket();
    return ws?.readyState ?? null;
  }
}

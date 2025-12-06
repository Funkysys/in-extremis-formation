/**
 * Gestionnaire de connexion WebSocket
 * Responsabilité : Connexion et reconnexion uniquement
 */

import type { WebSocketConfig } from "./types";

export class ChatConnectionManager {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config,
    };
  }

  connect(onSetup: (ws: WebSocket) => void): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.isIntentionallyClosed = false;

    const wsUrl = this.config.token
      ? `${this.config.url}?token=${this.config.token}`
      : this.config.url;

    console.log("🔌 Connexion WebSocket:", {
      roomId: this.config.roomId,
      hasToken: !!this.config.token,
    });

    try {
      this.ws = new WebSocket(wsUrl);
      onSetup(this.ws);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.handleReconnect(onSetup);
    }
  }

  private handleReconnect(onSetup: (ws: WebSocket) => void): void {
    if (
      this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5) ||
      this.isIntentionallyClosed
    ) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Reconnecting (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect(onSetup);
    }, this.config.reconnectInterval);
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      console.log("🔌 Déconnexion room:", this.config.roomId);
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
  }

  getWebSocket(): WebSocket | null {
    return this.ws;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }
}

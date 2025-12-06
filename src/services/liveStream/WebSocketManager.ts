/**
 * Gestion de la connexion WebSocket
 * Responsabilité : WebSocket uniquement
 */

import type { LiveStreamConfig, SignalingMessage } from "./types";

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private onBinaryData?: (data: ArrayBuffer) => void;
  private onSignaling?: (message: SignalingMessage) => void;
  private onDisconnect?: () => void;

  /**
   * Connecte le WebSocket
   */
  async connect(
    config: LiveStreamConfig,
    handlers: {
      onBinaryData: (data: ArrayBuffer) => void;
      onSignaling: (message: SignalingMessage) => void;
      onDisconnect: () => void;
    }
  ): Promise<void> {
    this.onBinaryData = handlers.onBinaryData;
    this.onSignaling = handlers.onSignaling;
    this.onDisconnect = handlers.onDisconnect;

    return new Promise((resolve, reject) => {
      const url = new URL(config.wsUrl);
      url.searchParams.set("role", "viewer");
      if (config.token) {
        url.searchParams.set("token", config.token);
      }

      this.ws = new WebSocket(url.toString());
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        console.log("✅ WebSocket connecté");
        resolve();
      };

      this.ws.onmessage = (event) => this.handleMessage(event);

      this.ws.onerror = () => reject(new Error("Erreur WebSocket"));

      this.ws.onclose = () => {
        console.log("🔌 WebSocket déconnecté");
        this.onDisconnect?.();
      };
    });
  }

  /**
   * Gère les messages WebSocket
   */
  private handleMessage(event: MessageEvent): void {
    // Message binaire = chunk vidéo
    if (event.data instanceof ArrayBuffer) {
      this.onBinaryData?.(event.data);
      return;
    }

    // Message JSON = signaling
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      this.onSignaling?.(message);
    } catch {
      console.warn("⚠️ Message invalide");
    }
  }

  /**
   * Envoie un message
   */
  send(type: string, data?: Record<string, unknown>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type, data }));
  }

  /**
   * Ferme la connexion
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Vérifie si connecté
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

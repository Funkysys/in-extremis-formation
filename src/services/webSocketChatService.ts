// Service WebSocket pour le chat temps réel
// Basé sur FRONTEND_API_REFERENCE : WS /chat/ws/{room_id}

export interface ChatMessage {
  id?: string;
  room_id: string;
  user_id: string;
  user_name?: string;
  message: string;
  createdAt?: string;
  type?:
    | "message"
    | "user_joined"
    | "user_left"
    | "typing"
    | "typing_start"
    | "typing_stop";
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

export class WebSocketChatService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config,
    };
  }

  /**
   * Établir la connexion WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.isIntentionallyClosed = false;

    // Construction de l'URL avec token si disponible
    const wsUrl = this.config.token
      ? `${this.config.url}?token=${this.config.token}`
      : this.config.url;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  /**
   * Configuration des écouteurs d'événements WebSocket
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log(`WebSocket connected to room: ${this.config.roomId}`);
      this.reconnectAttempts = 0;
      this.config.onConnect?.();
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.config.onMessage?.(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.config.onError?.(error);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      this.stopHeartbeat();
      this.config.onDisconnect?.();

      if (!this.isIntentionallyClosed) {
        this.handleReconnect();
      }
    };
  }

  /**
   * Envoyer un message
   */
  sendMessage(message: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const chatMessage: ChatMessage = {
      room_id: this.config.roomId,
      user_id: "", // Sera rempli côté serveur avec le user authentifié
      message,
      type: "message",
    };

    this.ws.send(JSON.stringify(chatMessage));
  }

  /**
   * Envoyer un indicateur de frappe
   */
  sendTyping(isTyping: boolean): void {
    if (this.ws?.readyState !== WebSocket.OPEN) return;

    const typingMessage = {
      room_id: this.config.roomId,
      type: isTyping ? "typing_start" : "typing_stop",
    };

    this.ws.send(JSON.stringify(typingMessage));
  }

  /**
   * Gestion de la reconnexion automatique
   */
  private handleReconnect(): void {
    if (
      this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5) ||
      this.isIntentionallyClosed
    ) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval);
  }

  /**
   * Heartbeat pour maintenir la connexion active
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Ping toutes les 30 secondes
  }

  /**
   * Arrêter le heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Fermer la connexion
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }
  }

  /**
   * Vérifier l'état de la connexion
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Obtenir l'état de la connexion
   */
  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }
}

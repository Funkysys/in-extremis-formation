/**
 * Service principal de streaming live
 * Responsabilité : Orchestration uniquement
 */

import { ChunkProcessor } from "./ChunkProcessor";
import { MediaSourceManager } from "./MediaSourceManager";
import { StreamStateManager } from "./StreamStateManager";
import type {
  LiveStreamCallbacks,
  LiveStreamConfig,
  SignalingMessage,
} from "./types";
import { WebSocketManager } from "./WebSocketManager";

export class LiveStreamService {
  private mediaSourceManager = new MediaSourceManager();
  private webSocketManager = new WebSocketManager();
  private stateManager = new StreamStateManager();
  private chunkProcessor: ChunkProcessor;
  private videoElement: HTMLVideoElement | null = null;
  private isShuttingDown = false; // ⚡ Flag pour ignorer les chunks pendant cleanup

  constructor() {
    this.chunkProcessor = new ChunkProcessor(this.mediaSourceManager);
  }

  async startStream(
    videoElement: HTMLVideoElement,
    config: LiveStreamConfig,
    callbacks?: LiveStreamCallbacks
  ): Promise<void> {
    console.error("🚀🚀🚀 START STREAM APPELÉ 🚀🚀🚀");

    if (!this.stateManager.canStart() || this.webSocketManager.isConnected()) {
      console.error("⚠️ startStream bloqué: canStart ou déjà connecté");
      return;
    }

    this.isShuttingDown = false; // Reset au démarrage
    this.stateManager.setStarting(true);
    this.videoElement = videoElement;
    this.stateManager.setCallbacks(callbacks || {});

    try {
      this.stateManager.updateStatus("connecting");

      // Force cleanup si invalide (ex: MediaSource fermé lors du précédent cycle)
      if (!this.mediaSourceManager.isValid()) {
        console.log("🧹 MediaSource invalide, cleanup forcé");
        this.mediaSourceManager.cleanup();
      }

      await this.mediaSourceManager.initialize(videoElement);

      this.mediaSourceManager.onUpdateEnd(() => {
        this.chunkProcessor.onAppendComplete();
      });

      await this.webSocketManager.connect(config, {
        onBinaryData: (data) => this.handleVideoData(data),
        onSignaling: (message) => this.handleSignaling(message),
        onDisconnect: () => {
          console.log("🔌 WebSocket déconnecté - activation shutdown");
          this.isShuttingDown = true; // ⚡ Bloquer immédiatement les nouveaux chunks
          this.chunkProcessor.clear(); // ⚡ Clear la queue
          this.stateManager.updateStatus("disconnected");
        },
      });

      this.stateManager.updateStatus("connected");
    } catch (error) {
      this.stateManager.handleError(error as Error);
      throw error;
    } finally {
      this.stateManager.setStarting(false);
    }
  }

  private handleVideoData(data: ArrayBuffer): void {
    // ⚡ Ignorer les chunks si on est en train de fermer
    if (this.isShuttingDown) {
      console.log("🚫 Chunk ignoré (shutdown en cours)");
      return;
    }

    if (this.stateManager.getStatus() === "connected") {
      this.stateManager.updateStatus("streaming");
    }
    this.chunkProcessor.addChunk(data);
  }

  private handleSignaling(message: SignalingMessage): void {
    const callbacks = this.stateManager.getCallbacks();

    switch (message.type) {
      case "metadata":
        callbacks.onMetadata?.(message.data || {});
        break;
      case "viewer_count":
        if (typeof message.viewer_count === "number") {
          callbacks.onViewerCount?.(message.viewer_count);
        }
        break;
      default:
        console.log("📨 Signaling:", message.type);
    }
  }

  sendMessage(type: string, data?: Record<string, unknown>): void {
    this.webSocketManager.send(type, data);
  }

  stopStream(): void {
    console.log("🛑 stopStream: début du shutdown");
    this.isShuttingDown = true; // ⚡ Bloquer tout nouveau chunk
    this.chunkProcessor.clear(); // ⚡ Vider immédiatement la queue

    this.stateManager.setStarting(false);
    this.webSocketManager.disconnect();
    this.mediaSourceManager.cleanup();

    if (this.videoElement?.src) {
      URL.revokeObjectURL(this.videoElement.src);
    }

    this.stateManager.updateStatus("disconnected");
    this.isShuttingDown = false; // Reset pour réutilisation potentielle
  }

  getStatus() {
    return this.stateManager.getStatus();
  }

  isStreaming() {
    return this.stateManager.isStreaming();
  }

  isValid() {
    return this.mediaSourceManager.isValid();
  }
}

// Singleton global (garde l'état entre les hot reloads)
let globalInstance: LiveStreamService | null = null;

export function getLiveStreamService(): LiveStreamService {
  // En dev, force une nouvelle instance si l'ancienne est invalide
  if (globalInstance && !globalInstance["mediaSourceManager"].isValid()) {
    console.log("🔄 Service invalide, création d'une nouvelle instance");
    globalInstance.stopStream();
    globalInstance = null;
  }

  if (!globalInstance) {
    console.log("✨ Création d'une nouvelle instance LiveStreamService");
    globalInstance = new LiveStreamService();
  }

  return globalInstance;
}

// Backward compatibility
export const liveStreamService = getLiveStreamService();

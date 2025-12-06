/**
 * ⚠️ FICHIER DÉPRÉCIÉ - Redirige vers la nouvelle architecture modulaire
 *
 * Le service a été découpé en modules spécialisés :
 * - types.ts : Types et interfaces
 * - MediaSourceManager.ts : Gestion MSE
 * - WebSocketManager.ts : Gestion WebSocket
 * - ChunkProcessor.ts : Traitement des chunks
 * - index.ts : Orchestration
 */

export type {
  LiveStreamCallbacks,
  LiveStreamConfig,
  LiveStreamStatus,
} from "./liveStream/types";

export { liveStreamService } from "./liveStream/index";

import type {
  LiveStreamCallbacks,
  LiveStreamConfig,
  LiveStreamStatus,
} from "./liveStream/types";

// Classe obsolète - ne pas utiliser
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class _DeprecatedLiveStreamService {
  // WebSocket
  private ws: WebSocket | null = null;

  // Media Source Extensions
  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;
  private videoElement: HTMLVideoElement | null = null;

  // État
  private status: LiveStreamStatus = "disconnected";
  private callbacks: LiveStreamCallbacks = {};

  // Gestion des chunks
  private pendingChunks: ArrayBuffer[] = [];
  private isAppending = false;
  private nextTimestampOffset = 0; // Position continue pour les chunks

  // Protection contre les appels multiples
  private isStarting = false;
  private lastStopTime = 0;

  async startStream(
    videoElement: HTMLVideoElement,
    config: LiveStreamConfig,
    callbacks?: LiveStreamCallbacks
  ): Promise<void> {
    // Protection: éviter les démarrages multiples
    if (this.isStarting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // Vérifier le support MSE
    if (!("MediaSource" in window)) {
      const error = new Error("Media Source Extensions non supporté");
      this.handleError(error);
      throw error;
    }

    this.isStarting = true;
    this.videoElement = videoElement;
    this.callbacks = callbacks || {};

    try {
      this.updateStatus("connecting");

      // Initialiser MediaSource
      await this.initializeMediaSource(videoElement);

      // Connecter WebSocket
      await this.connectWebSocket(config);

      this.updateStatus("connected");
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Initialise MediaSource et attend qu'il soit prêt
   */
  private async initializeMediaSource(
    videoElement: HTMLVideoElement
  ): Promise<void> {
    this.mediaSource = new MediaSource();
    videoElement.src = URL.createObjectURL(this.mediaSource);
    const mediaSourceRef = this.mediaSource;

    // Listener d'erreur vidéo
    videoElement.addEventListener("error", () => {
      console.error("❌ Erreur élément vidéo:", videoElement.error);
    });

    // Attendre que MediaSource soit ouvert
    await new Promise<void>((resolve, reject) => {
      const onSourceOpen = () => {
        if (mediaSourceRef.readyState === "open") {
          resolve();
        } else {
          reject(
            new Error(
              `MediaSource state invalide: ${mediaSourceRef.readyState}`
            )
          );
        }
      };

      const onError = () => reject(new Error("Erreur MediaSource"));

      if (mediaSourceRef.readyState === "open") {
        resolve();
      } else {
        mediaSourceRef.addEventListener("sourceopen", onSourceOpen, {
          once: true,
        });
        mediaSourceRef.addEventListener("error", onError, { once: true });
      }
    });

    // Créer le SourceBuffer avec le bon codec
    await this.createSourceBuffer(mediaSourceRef);
  }

  /**
   * Crée le SourceBuffer avec le meilleur codec supporté
   */
  private async createSourceBuffer(mediaSource: MediaSource): Promise<void> {
    // Liste des codecs à essayer (ordre de préférence)
    const codecOptions = [
      'video/webm; codecs="vp8, opus"',
      'video/webm; codecs="vp8"',
      'video/webm; codecs="vp9"',
      "video/webm",
    ];

    // Trouver le premier codec supporté
    const mimeType = codecOptions.find((codec) =>
      MediaSource.isTypeSupported(codec)
    );

    if (!mimeType) {
      throw new Error("Aucun codec vidéo supporté par le navigateur");
    }

    // Vérifier que le MediaSource est toujours valide
    if (!this.mediaSource || this.mediaSource !== mediaSource) {
      throw new Error("MediaSource a été nettoyé");
    }

    if (this.mediaSource.readyState !== "open") {
      throw new Error(`MediaSource fermé: ${this.mediaSource.readyState}`);
    }

    // Créer le SourceBuffer
    this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
    this.sourceBuffer.mode = "segments"; // Mode requis pour timestampOffset
    this.sourceBuffer.timestampOffset = 0;

    // Configurer les listeners
    this.setupSourceBufferListeners();

    console.log(`✅ SourceBuffer créé: ${mimeType}`);
  }

  /**
   * Configure les listeners pour les événements SourceBuffer
   */
  private setupSourceBufferListeners(): void {
    if (!this.sourceBuffer) return;

    // updateend: appelé quand appendBuffer() est terminé
    this.sourceBuffer.addEventListener("updateend", () => {
      this.isAppending = false;

      // Vérifier que tout est encore valide
      if (!this.isMediaSourceValid() || !this.sourceBuffer) {
        return;
      }

      try {
        // Mettre à jour nextTimestampOffset pour forcer une timeline continue
        if (this.sourceBuffer.buffered.length > 0) {
          const lastEnd = this.sourceBuffer.buffered.end(
            this.sourceBuffer.buffered.length - 1
          );
          this.nextTimestampOffset = lastEnd;

          // Debug: afficher les ranges buffered
          const ranges = Array.from(
            { length: this.sourceBuffer.buffered.length },
            (_, i) =>
              `[${this.sourceBuffer!.buffered.start(i).toFixed(
                3
              )}-${this.sourceBuffer!.buffered.end(i).toFixed(3)}]`
          ).join(", ");
          console.log(`📦 Buffer: ${ranges}`);
        }

        // Traiter le prochain chunk en attente
        this.processNextChunk();
      } catch {
        console.warn("⚠️ SourceBuffer détaché pendant updateend");
        this.cleanup();
      }
    });

    // error: appelé en cas d'erreur SourceBuffer
    this.sourceBuffer.addEventListener("error", () => {
      // Ignorer les erreurs après cleanup (démontage React)
      if (!this.isMediaSourceValid()) {
        return;
      }
      console.error("❌ Erreur SourceBuffer");
      this.handleError(new Error("Erreur SourceBuffer"));
    });
  }

  /**
   * Vérifie si MediaSource et SourceBuffer sont valides
   */
  private isMediaSourceValid(): boolean {
    return !!(
      this.mediaSource &&
      this.mediaSource.readyState === "open" &&
      this.sourceBuffer
    );
  }

  /**
   * Connecte le WebSocket au serveur de streaming
   */
  private async connectWebSocket(config: LiveStreamConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // Construire l'URL avec les paramètres
      const url = new URL(config.wsUrl);
      url.searchParams.set("role", "viewer");
      if (config.token) {
        url.searchParams.set("token", config.token);
      }

      // Créer la connexion WebSocket
      this.ws = new WebSocket(url.toString());
      this.ws.binaryType = "arraybuffer";

      // Listeners
      this.ws.onopen = () => {
        console.log("✅ WebSocket connecté");
        resolve();
      };

      this.ws.onmessage = (event) => this.handleWebSocketMessage(event);

      this.ws.onerror = () => reject(new Error("Erreur WebSocket"));

      this.ws.onclose = () => {
        console.log("🔌 WebSocket déconnecté");
        this.updateStatus("disconnected");
      };
    });
  }

  /**
   * Gère les messages WebSocket (binaires ou JSON)
   */
  private handleWebSocketMessage(event: MessageEvent): void {
    // Message binaire = chunk vidéo
    if (event.data instanceof ArrayBuffer) {
      this.handleVideoData(event.data);
      return;
    }

    // Message JSON = signaling (metadata, viewer count, etc.)
    try {
      const message = JSON.parse(event.data);
      this.handleSignalingMessage(message);
    } catch {
      console.warn("⚠️ Message WebSocket invalide");
    }
  }

  /**
   * Gère les données vidéo binaires (init segment ou media chunks)
   */
  private handleVideoData(data: ArrayBuffer): void {
    if (!this.sourceBuffer) {
      console.warn("⚠️ Chunk ignoré (SourceBuffer non prêt)");
      return;
    }

    // Détecter si c'est un init segment WebM (commence par 0x1A45DFA3)
    const bytes = new Uint8Array(data);
    const isInitSegment =
      bytes[0] === 0x1a &&
      bytes[1] === 0x45 &&
      bytes[2] === 0xdf &&
      bytes[3] === 0xa3;

    if (isInitSegment) {
      // Init segment = priorité absolue (doit être en premier)
      this.pendingChunks.unshift(data);
      console.log(`🎬 Init segment: ${data.byteLength}b`);
    } else {
      // Media chunk standard
      this.pendingChunks.push(data);
    }

    // Passer en mode streaming
    if (this.status === "connected") {
      this.updateStatus("streaming");
    }

    // Traiter la queue
    this.processNextChunk();
  }

  /**
   * Traite le prochain chunk de la queue
   * Gère timestampOffset pour forcer une timeline continue
   */
  private processNextChunk(): void {
    // Conditions de sortie rapide
    if (!this.sourceBuffer || this.isAppending || !this.pendingChunks.length) {
      return;
    }

    // Vérifier que SourceBuffer n'est pas occupé
    if (!this.isSourceBufferReady()) {
      return;
    }

    // Récupérer le prochain chunk
    const chunk = this.pendingChunks.shift();
    if (!chunk) return;

    // Appliquer timestampOffset et ajouter le chunk
    try {
      this.isAppending = true;
      this.sourceBuffer.timestampOffset = this.nextTimestampOffset;
      this.sourceBuffer.appendBuffer(chunk);

      console.log(`🕐 Chunk @ ${this.nextTimestampOffset.toFixed(3)}s`);
    } catch (error) {
      this.isAppending = false;

      const errMsg = (error as Error).message;
      if (
        errMsg.includes("not, or is no longer, usable") ||
        errMsg.includes("removed")
      ) {
        console.warn("⚠️ SourceBuffer détaché");
        this.cleanup();
      } else {
        this.handleError(error as Error);
      }
    }
  }

  /**
   * Vérifie que le SourceBuffer est prêt à accepter des données
   */
  private isSourceBufferReady(): boolean {
    if (!this.isMediaSourceValid()) {
      this.cleanup();
      return false;
    }

    try {
      // Vérifier que le SourceBuffer n'est pas en train de traiter
      if (this.sourceBuffer!.updating) {
        return false;
      }

      // Vérifier que le SourceBuffer est accessible
      void this.sourceBuffer!.buffered;
      return true;
    } catch {
      console.warn("⚠️ SourceBuffer détaché");
      this.cleanup();
      return false;
    }
  }

  private handleSignalingMessage(message: Record<string, unknown>): void {
    switch (message.type) {
      case "metadata":
        if (message.data && typeof message.data === "object") {
          this.callbacks.onMetadata?.(message.data as Record<string, unknown>);
        }
        break;
      case "viewer_count":
        if (typeof message.count === "number") {
          this.callbacks.onViewerCount?.(message.count);
        }
        break;
      case "stream_end":
        this.stopStream();
        break;
      default:
        console.log("📨 Message:", message);
    }
  }

  sendMessage(type: string, data?: Record<string, unknown>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type, data }));
  }

  /**
   * Nettoie les ressources sans changer le status
   */
  private cleanup(): void {
    this.pendingChunks = [];
    this.isAppending = false;
    this.sourceBuffer = null;
    this.mediaSource = null;
  }

  /**
   * Arrête complètement le streaming
   */
  stopStream(): void {
    this.isStarting = false;
    this.lastStopTime = Date.now();

    // Fermer WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Nettoyer SourceBuffer
    if (this.sourceBuffer) {
      this.sourceBuffer = null;
    }

    // Fermer MediaSource
    if (this.mediaSource) {
      try {
        if (this.mediaSource.readyState === "open") {
          this.mediaSource.endOfStream();
        }
      } catch {}
      this.mediaSource = null;
    }

    // Révoquer l'URL de la vidéo
    if (this.videoElement?.src) {
      URL.revokeObjectURL(this.videoElement.src);
    }

    this.cleanup();
    this.updateStatus("disconnected");
  }

  private updateStatus(status: LiveStreamStatus): void {
    this.status = status;
    this.callbacks.onStatusChange?.(status);
  }

  private handleError(error: Error): void {
    console.error("❌ Erreur Live Stream:", error);
    this.updateStatus("error");
    this.callbacks.onError?.(error);
  }

  getStatus(): LiveStreamStatus {
    return this.status;
  }

  isStreaming(): boolean {
    return this.status === "streaming";
  }
}

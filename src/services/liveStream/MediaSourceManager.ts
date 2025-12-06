/**
 * Orchestrateur MediaSource
 * Responsabilité : Coordination MSE components
 */

import { MediaSourceInitializer } from "./MediaSourceInitializer";
import { PlaybackStarter } from "./PlaybackStarter";
import { SourceBufferManager } from "./SourceBufferManager";

export class MediaSourceManager {
  private initializer = new MediaSourceInitializer();
  private bufferManager = new SourceBufferManager();
  private playbackStarter = new PlaybackStarter();
  private isInitialized = false;
  private updateEndListenerAttached = false;

  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    console.error(
      `🎬🎬🎬 INITIALIZE APPELÉ, video element: ${videoElement.id || "no-id"}`
    );

    // Éviter double initialisation (React Strict Mode double mount)
    if (this.isInitialized && this.isValid()) {
      console.log("⚠️ MediaSource déjà initialisé, on skip");
      return;
    }

    // Si déjà initialisé mais invalide, on cleanup avant
    if (this.isInitialized && !this.isValid()) {
      console.log("🧹 MediaSource invalide, on cleanup avant réinit");
      this.cleanup();
    }

    const mediaSource = await this.initializer.initialize(videoElement);
    const sourceBuffer = this.initializer.createSourceBuffer(mediaSource);

    this.bufferManager.setSourceBuffer(sourceBuffer, mediaSource);
    this.playbackStarter.setVideoElement(videoElement);
    this.isInitialized = true;
  }

  onUpdateEnd(callback: () => void): void {
    if (!this.bufferManager.isReady()) return;

    // Ne pas attacher plusieurs fois le listener
    if (this.updateEndListenerAttached) {
      console.log("⚠️ Listener updateend déjà attaché, on skip");
      return;
    }

    // Récupérer le SourceBuffer depuis le bufferManager
    const sb = (
      this.bufferManager as unknown as { sourceBuffer: SourceBuffer | null }
    ).sourceBuffer;

    if (!sb) {
      console.error("❌ Impossible d'attacher updateend: SourceBuffer null");
      return;
    }

    // 🚨 Logs de debug des événements
    sb.addEventListener("updatestart", () => {
      console.log("🔵 updatestart (updating=" + sb.updating + ")");
    });
    sb.addEventListener("update", () => {
      console.log("🔵 update (updating=" + sb.updating + ")");
    });

    const updateHandler = () => {
      console.log("🟢 updateend (updating=" + sb.updating + ")");

      if (!this.isValid()) {
        console.warn("⚠️ MediaSource invalide dans updateend");
        return;
      }

      try {
        // Attendre la fin de l'event loop pour que updating repasse à false
        setTimeout(() => {
          if (sb.updating) {
            console.warn(
              "⚠️ SourceBuffer encore en updating après setTimeout, on attend 10ms"
            );
            setTimeout(() => callback(), 10);
          } else {
            console.log("✅ Callback updateend OK, updating=false");
            callback();
          }
        }, 0);
      } catch (error) {
        console.error("❌ Erreur updateend:", error);
      }
    };

    sb.addEventListener("updateend", updateHandler);
    this.updateEndListenerAttached = true;
    console.log("✅ Listeners attachés (updatestart, update, updateend)");
  }

  appendChunk(chunk: ArrayBuffer): void {
    // Vérifier l'état du MediaSource avant append
    const ms = this.initializer.getMediaSource();
    const msState = ms?.readyState;
    const msId = (this.initializer as unknown as { mediaSourceId: string })
      .mediaSourceId;
    console.log(`🔍 MediaSource #${msId} readyState AVANT append: ${msState}`);

    if (msState !== "open") {
      console.error(`❌ MediaSource n'est pas ouvert ! State=${msState}`);
      throw new Error(`MediaSource fermé (${msState})`);
    }

    // Vérifier que le SourceBuffer est toujours attaché au MediaSource
    const sb = (
      this.bufferManager as unknown as { sourceBuffer: SourceBuffer | null }
    ).sourceBuffer;
    const sbInMs = ms?.sourceBuffers.length || 0;
    const sbIsAttached =
      ms && sb !== null && Array.from(ms.sourceBuffers).includes(sb);
    console.log(
      `🔍 SourceBuffers dans MS: ${sbInMs}, notre SB est attaché: ${sbIsAttached}`
    );

    if (!sbIsAttached) {
      console.error(`❌ SourceBuffer n'est plus attaché au MediaSource !`);
      throw new Error("SourceBuffer détaché du MediaSource");
    }

    this.bufferManager.appendChunk(chunk);
  }

  isReady(): boolean {
    return this.bufferManager.isReady();
  }

  isValid(): boolean {
    const initValid = this.initializer.isValid();
    const bufferReady = this.bufferManager.isReady();
    console.log(`🔍 isValid: init=${initValid}, buffer=${bufferReady}`);
    return initValid && bufferReady;
  }

  cleanup(): void {
    this.bufferManager.cleanup();
    this.playbackStarter.reset();
    this.initializer.cleanup();
    this.isInitialized = false;
    this.updateEndListenerAttached = false;
  }
}

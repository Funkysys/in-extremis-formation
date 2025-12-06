/**
 * Traitement des chunks vidéo
 * Responsabilité : Queue et traitement des chunks uniquement
 */

import type { MediaSourceManager } from "./MediaSourceManager";

export class ChunkProcessor {
  private pendingChunks: ArrayBuffer[] = [];
  private isAppending = false;

  constructor(private mediaSourceManager: MediaSourceManager) {}

  /**
   * Ajoute un chunk vidéo à la queue
   */
  addChunk(data: ArrayBuffer): void {
    // Détecter init segment WebM (0x1A45DFA3)
    const bytes = new Uint8Array(data);
    const isInitSegment =
      bytes[0] === 0x1a &&
      bytes[1] === 0x45 &&
      bytes[2] === 0xdf &&
      bytes[3] === 0xa3;

    if (isInitSegment) {
      // Init segment = priorité absolue
      this.pendingChunks.unshift(data);
      console.log(`🎬 Init segment: ${data.byteLength}b`);
    } else {
      this.pendingChunks.push(data);
    }

    this.processNext();
  }

  /**
   * Traite le prochain chunk de la queue
   */
  processNext(): void {
    // Conditions de sortie
    if (this.isAppending || !this.pendingChunks.length) {
      return;
    }

    if (!this.mediaSourceManager.isReady()) {
      return;
    }

    // Récupérer le chunk
    const chunk = this.pendingChunks.shift();
    if (!chunk) return;

    // Ajouter au SourceBuffer
    try {
      this.isAppending = true;
      this.mediaSourceManager.appendChunk(chunk);
    } catch (error) {
      this.isAppending = false;

      const errMsg = (error as Error).message;

      // Si c'est juste "updating", on remet le chunk et on réessaiera
      if (errMsg.includes("updating")) {
        this.pendingChunks.unshift(chunk);
        return;
      }

      if (
        errMsg.includes("not, or is no longer, usable") ||
        errMsg.includes("removed")
      ) {
        console.warn("⚠️ SourceBuffer détaché");
        this.clear();
      } else {
        throw error;
      }
    }
  }

  /**
   * Appelé quand appendBuffer est terminé
   */
  onAppendComplete(): void {
    this.isAppending = false;
    this.processNext();
  }

  /**
   * Vide la queue
   */
  clear(): void {
    this.pendingChunks = [];
    this.isAppending = false;
  }
}

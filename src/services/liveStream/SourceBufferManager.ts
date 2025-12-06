/**
 * Gestion du SourceBuffer et des chunks
 * Responsabilité : Append chunks et gestion buffer
 */

export class SourceBufferManager {
  private sourceBuffer: SourceBuffer | null = null;
  private nextTimestampOffset = 0;
  private sourceBufferId = 0;
  private parentMediaSource: MediaSource | null = null;

  setSourceBuffer(sourceBuffer: SourceBuffer, mediaSource: MediaSource): void {
    this.sourceBufferId = Date.now();
    this.sourceBuffer = sourceBuffer;
    this.parentMediaSource = mediaSource;

    // ⚡ Mode "sequence": le navigateur gère automatiquement les timestamps
    // Cela évite de toucher à timestampOffset qui peut corrompre le SourceBuffer
    this.sourceBuffer.mode = "sequence";

    console.log(
      `📌 SourceBuffer #${this.sourceBufferId} défini (mode=sequence)`
    );
  }

  appendChunk(chunk: ArrayBuffer): void {
    if (!this.sourceBuffer) {
      console.error("❌ SourceBuffer est NULL");
      throw new Error("SourceBuffer null");
    }

    console.log(
      `🔍 AVANT append: SB #${this.sourceBufferId}, updating=${this.sourceBuffer.updating}, chunk=${chunk.byteLength}b`
    );

    // ⚡ VÉRIFIER SI LE SOURCEBUFFER EST ENCORE EN TRAIN DE TRAITER
    if (this.sourceBuffer.updating) {
      console.error(
        `❌ SourceBuffer est en updating ! On ne peut pas append maintenant`
      );
      throw new Error("SourceBuffer is updating");
    }

    try {
      // ⚡ NE PLUS TOUCHER À timestampOffset - mode sequence le gère
      this.sourceBuffer.appendBuffer(chunk);
      console.log(`✅ appendBuffer() OK, ${chunk.byteLength}b appended`);
    } catch (error) {
      console.error("❌ appendBuffer failed:", error);
      console.error(
        `   updating=${this.sourceBuffer.updating}, mode=${this.sourceBuffer.mode}`
      );
      throw error;
    }
  }

  updateTimestamp(): void {
    if (!this.sourceBuffer?.buffered.length) return;

    const lastEnd = this.sourceBuffer.buffered.end(
      this.sourceBuffer.buffered.length - 1
    );
    this.nextTimestampOffset = lastEnd;
  }

  getBufferRanges(): string {
    if (!this.sourceBuffer) return "";

    return Array.from(
      { length: this.sourceBuffer.buffered.length },
      (_, i) =>
        `[${this.sourceBuffer!.buffered.start(i).toFixed(
          3
        )}-${this.sourceBuffer!.buffered.end(i).toFixed(3)}]`
    ).join(", ");
  }

  getBufferStart(): number | null {
    if (!this.sourceBuffer?.buffered.length) return null;
    return this.sourceBuffer.buffered.start(0);
  }

  isReady(): boolean {
    if (!this.sourceBuffer) return false;

    try {
      if (this.sourceBuffer.updating) return false;
      void this.sourceBuffer.buffered;
      return true;
    } catch {
      return false;
    }
  }

  cleanup(): void {
    this.sourceBuffer = null;
    this.nextTimestampOffset = 0;
  }
}

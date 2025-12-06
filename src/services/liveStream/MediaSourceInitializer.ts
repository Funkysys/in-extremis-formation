/**
 * Gestion du MediaSource
 * Responsabilité : Initialisation MSE et codec selection
 */

export class MediaSourceInitializer {
  private mediaSource: MediaSource | null = null;
  private mediaSourceId = 0; // ID pour tracer les instances

  async initialize(videoElement: HTMLVideoElement): Promise<MediaSource> {
    if (!("MediaSource" in window)) {
      throw new Error("Media Source Extensions non supporté");
    }

    this.mediaSourceId = Date.now();
    this.mediaSource = new MediaSource();
    videoElement.src = URL.createObjectURL(this.mediaSource);

    // Tracker les changements d'état
    this.mediaSource.addEventListener("sourceopen", () => {
      console.log(`🟢 MediaSource #${this.mediaSourceId}: sourceopen`);
    });
    this.mediaSource.addEventListener("sourceended", () => {
      console.log("🔴 MediaSource: sourceended");
    });
    this.mediaSource.addEventListener("sourceclose", () => {
      console.log("🔴 MediaSource: sourceclose");
    });

    await new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        if (this.mediaSource?.readyState === "open") {
          resolve();
        } else {
          reject(new Error("MediaSource invalide"));
        }
      };

      if (this.mediaSource!.readyState === "open") {
        resolve();
      } else {
        this.mediaSource!.addEventListener("sourceopen", onOpen, {
          once: true,
        });
        this.mediaSource!.addEventListener(
          "error",
          () => reject(new Error("Erreur MediaSource")),
          { once: true }
        );
      }
    });

    return this.mediaSource;
  }

  createSourceBuffer(mediaSource: MediaSource): SourceBuffer {
    const codecs = [
      'video/webm; codecs="vp8, opus"',
      'video/webm; codecs="vp8"',
      'video/webm; codecs="vp9"',
      "video/webm",
    ];

    const mimeType = codecs.find((codec) => MediaSource.isTypeSupported(codec));
    if (!mimeType) {
      throw new Error("Aucun codec supporté");
    }

    if (mediaSource.readyState !== "open") {
      throw new Error("MediaSource fermé");
    }

    const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
    console.log(
      `✅ SourceBuffer créé pour MediaSource #${this.mediaSourceId}: ${mimeType}`
    );

    // 🚨 Logs d'erreur seulement
    sourceBuffer.addEventListener("error", (e) => {
      console.error("🔴 SourceBuffer: ERROR", e);
    });
    sourceBuffer.addEventListener("abort", () => {
      console.error("🔴 SourceBuffer: ABORT");
    });

    return sourceBuffer;
  }

  isValid(): boolean {
    const state = this.mediaSource?.readyState;
    const valid = !!(this.mediaSource && state === "open");
    console.log(
      `🔍 MediaSourceInitializer.isValid(): state=${state}, valid=${valid}`
    );
    return valid;
  }

  cleanup(): void {
    if (this.mediaSource) {
      try {
        if (this.mediaSource.readyState === "open") {
          this.mediaSource.endOfStream();
        }
      } catch {}
      this.mediaSource = null;
    }
  }

  getMediaSource(): MediaSource | null {
    return this.mediaSource;
  }
}

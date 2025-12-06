/**
 * Gestion du démarrage de la lecture vidéo
 * Responsabilité : Seek au buffer start pour live playback
 */

export class PlaybackStarter {
  private hasStarted = false;
  private videoElement: HTMLVideoElement | null = null;

  setVideoElement(element: HTMLVideoElement): void {
    this.videoElement = element;
    this.hasStarted = false;
  }

  tryStart(bufferStart: number | null): void {
    if (this.hasStarted || !this.videoElement || bufferStart === null) {
      return;
    }

    console.log(
      `🔍 DEBUG: hasStartedPlayback=${
        this.hasStarted
      }, bufferStart=${bufferStart.toFixed(3)}s`
    );

    // ⚠️ Ne rien faire ici - la vidéo démarre automatiquement
    // Le play() est déjà appelé ailleurs au bon moment
    // Toute manipulation ici (seek, play) détache le SourceBuffer pendant updateend

    console.log("✅ Playback ready, waiting for natural start");
    this.hasStarted = true;
  }

  reset(): void {
    this.hasStarted = false;
    this.videoElement = null;
  }
}

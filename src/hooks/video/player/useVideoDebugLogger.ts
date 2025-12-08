/**
 * Hook de debug pour les événements vidéo
 * Responsabilité : Logging uniquement
 */

export function useVideoDebugLogger() {
  const onPlay = (video: HTMLVideoElement) => {
    console.log("🎬 Vidéo: lecture démarrée");
    console.log(`🔍 État vidéo après play:`);
    console.log(`   readyState: ${video.readyState}`);
    console.log(`   networkState: ${video.networkState}`);
    console.log(`   paused: ${video.paused}`);
    console.log(`   currentTime: ${video.currentTime}`);
    console.log(`   buffered.length: ${video.buffered.length}`);
  };

  const onPause = () => {
    console.log("⏸️ Vidéo: lecture en pause");
  };

  const onLoadedMetadata = (video: HTMLVideoElement) => {
    console.log(
      `📊 Métadonnées chargées: ${video.videoWidth}x${video.videoHeight}, durée: ${video.duration}`
    );
    console.log(`🔍 État vidéo après métadonnées:`);
    console.log(
      `   readyState: ${video.readyState} (0=NOTHING, 1=METADATA, 2=CURRENT_DATA, 3=FUTURE_DATA, 4=ENOUGH_DATA)`
    );
    console.log(
      `   networkState: ${video.networkState} (0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE)`
    );
    console.log(`   paused: ${video.paused}`);
    console.log(`   currentTime: ${video.currentTime}`);
    console.log(`   buffered.length: ${video.buffered.length}`);

    if (video.buffered.length > 0) {
      console.log(
        `   buffered ranges: ${Array.from(
          { length: video.buffered.length },
          (_, i) =>
            `[${video.buffered.start(i).toFixed(3)}-${video.buffered
              .end(i)
              .toFixed(3)}]`
        ).join(", ")}`
      );
    }
  };

  const onTimeUpdate = (video: HTMLVideoElement) => {
    // Log toutes les secondes pour détecter si le temps avance
    const lastLog = video.dataset.lastLogTime
      ? parseInt(video.dataset.lastLogTime)
      : 0;
    const now = Date.now();

    if (now - lastLog > 1000 || lastLog === 0) {
      const bufferedEnd =
        video.buffered.length > 0 ? video.buffered.end(0).toFixed(3) : "0";
      console.log(
        `⏱️ Time: ${video.currentTime.toFixed(3)}s, paused: ${
          video.paused
        }, ready: ${video.readyState}, buffered: 0-${bufferedEnd}s`
      );
      video.dataset.lastLogTime = now.toString();
    }
  };

  return {
    onPlay,
    onPause,
    onLoadedMetadata,
    onTimeUpdate,
  };
}

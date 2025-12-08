import type { SourceType } from "./types";

/**
 * Capture la source média selon le type demandé
 */
export async function captureMediaSource(
  sourceType: SourceType,
  deviceId?: string
): Promise<MediaStream> {
  if (sourceType === "audio") {
    return await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  }

  if (sourceType === "screen") {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1920, height: 1080 },
      audio: false,
    });
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    return new MediaStream([
      ...displayStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);
  }

  return await navigator.mediaDevices.getUserMedia({
    video: deviceId
      ? { deviceId, width: 1280, height: 720 }
      : { width: 1280, height: 720 },
    audio: true,
  });
}

/**
 * Obtient la résolution selon le type de source
 */
export function getResolution(sourceType: SourceType): string {
  if (sourceType === "audio") return "audio-only";
  if (sourceType === "screen") return "1080p";
  return "720p";
}

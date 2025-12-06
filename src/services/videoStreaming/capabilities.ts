import type { StreamingCapabilities } from "./types";

/**
 * Détecte les capacités de streaming du navigateur
 */
export function detectCapabilities(): StreamingCapabilities {
  const video = document.createElement("video");

  // HLS natif (Safari)
  const supportsNativeHLS =
    video.canPlayType("application/vnd.apple.mpegurl") !== "";

  // Media Source Extensions (Chrome, Firefox, Edge)
  const supportsMSE = "MediaSource" in window;

  // Peut utiliser HLS (natif ou via HLS.js)
  const supportsHLS = supportsNativeHLS || supportsMSE;

  return {
    supportsHLS,
    supportsMSE,
    supportsNativeHLS,
  };
}

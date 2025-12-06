import { detectCapabilities } from "./capabilities";
import type {
  StreamingCapabilities,
  StreamingMethod,
  StreamSource,
  VideoStreamOptions,
} from "./types";
import { getDirectUrl, getHLSUrl } from "./urlGenerators";

/**
 * Détermine la meilleure méthode de streaming
 */
export function getBestStreamingMethod(
  capabilities: StreamingCapabilities
): StreamingMethod {
  return capabilities.supportsHLS ? "hls" : "direct";
}

/**
 * Génère l'URL de streaming optimale selon les capacités du navigateur
 */
export function getOptimalStreamUrl(options: VideoStreamOptions): {
  url: string;
  method: StreamingMethod;
  capabilities: StreamingCapabilities;
} {
  const capabilities = detectCapabilities();
  const method = options.method || getBestStreamingMethod(capabilities);

  let url: string;

  if (method === "hls" && capabilities.supportsHLS) {
    url = getHLSUrl(options.videoId, options.token, options.quality);
  } else {
    url = getDirectUrl(options.videoId, options.token, options.quality);
  }

  return {
    url,
    method: capabilities.supportsHLS ? "hls" : "direct",
    capabilities,
  };
}

/**
 * Génère les sources multiples pour un player avec fallback
 */
export function getMultiSourceConfig(options: VideoStreamOptions) {
  const capabilities = detectCapabilities();
  const sources: StreamSource[] = [];

  if (capabilities.supportsHLS) {
    sources.push({
      src: getHLSUrl(options.videoId, options.token, options.quality),
      type: "application/x-mpegURL",
    });
  }

  sources.push({
    src: getDirectUrl(options.videoId, options.token, options.quality),
    type: "video/mp4",
  });

  return {
    sources,
    capabilities,
    method: sources[0].type === "application/x-mpegURL" ? "hls" : "direct",
  };
}

/**
 * Configure le player vidéo avec support Range requests
 */
export function setupRangeRequestSupport(videoElement: HTMLVideoElement): void {
  videoElement.addEventListener("seeking", () => {
    console.debug("Seeking - Range request automatique");
  });

  videoElement.addEventListener("error", (e) => {
    console.error("Erreur vidéo:", e);
  });
}

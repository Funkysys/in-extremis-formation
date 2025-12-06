/**
 * Service de streaming vidéo avec support HLS et Direct Streaming
 * Backend URL: http://localhost:8000
 *
 * Endpoints disponibles:
 * - GET /stream/video/{id} - Direct streaming avec Range requests
 * - GET /stream/video/{id}/manifest.m3u8 - HLS manifest
 * - GET /stream/video/{id}/quality/{quality} - Streaming avec qualité spécifique
 */

export type {
  StreamingCapabilities,
  StreamingMethod,
  StreamSource,
  VideoQuality,
  VideoStreamOptions,
} from "./videoStreaming/types";

export { detectCapabilities } from "./videoStreaming/capabilities";
export {
  getBestStreamingMethod,
  getMultiSourceConfig,
  getOptimalStreamUrl,
  setupRangeRequestSupport,
} from "./videoStreaming/streamingHelpers";
export {
  getAvailableQualities,
  getDirectUrl,
  getHLSUrl,
  testStreamUrl,
} from "./videoStreaming/urlGenerators";

class VideoStreamingService {
  detectCapabilities = detectCapabilities;
  getHLSUrl = getHLSUrl;
  getDirectUrl = getDirectUrl;
  getBestStreamingMethod = getBestStreamingMethod;
  getOptimalStreamUrl = getOptimalStreamUrl;
  testStreamUrl = testStreamUrl;
  getAvailableQualities = getAvailableQualities;
  setupRangeRequestSupport = setupRangeRequestSupport;
  getMultiSourceConfig = getMultiSourceConfig;
}

export const videoStreamingService = new VideoStreamingService();

import {
  detectCapabilities,
  getAvailableQualities,
  getBestStreamingMethod,
  getDirectUrl,
  getHLSUrl,
  getMultiSourceConfig,
  getOptimalStreamUrl,
  setupRangeRequestSupport,
  testStreamUrl,
} from "./videoStreamingService";

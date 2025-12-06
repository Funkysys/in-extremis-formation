export type VideoQuality = "auto" | "1080p" | "720p" | "480p" | "360p";
export type StreamingMethod = "hls" | "direct";

export interface VideoStreamOptions {
  videoId: string;
  token: string;
  quality?: VideoQuality;
  method?: StreamingMethod;
}

export interface StreamingCapabilities {
  supportsHLS: boolean;
  supportsMSE: boolean;
  supportsNativeHLS: boolean;
}

export interface StreamSource {
  src: string;
  type: string;
}

/**
 * Types et interfaces pour le streaming live
 */

export type LiveStreamStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "streaming"
  | "error";

export interface LiveStreamConfig {
  wsUrl: string;
  token?: string;
  mimeType?: string;
}

export interface LiveStreamCallbacks {
  onStatusChange?: (status: LiveStreamStatus) => void;
  onError?: (error: Error) => void;
  onMetadata?: (metadata: Record<string, unknown>) => void;
  onViewerCount?: (count: number) => void;
}

export interface SignalingMessage {
  type: string;
  data?: Record<string, unknown>;
  stream_id?: string;
  viewer_count?: number;
}

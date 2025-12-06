export type SourceType = "camera" | "screen" | "audio";

export interface StartBroadcastOptions {
  streamId: string;
  token?: string;
  sourceType: SourceType;
  deviceId?: string;
  bitrate: number;
}

export interface BroadcastRefs {
  ws: WebSocket | null;
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  isStarting: boolean;
}

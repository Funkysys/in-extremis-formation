import type { LiveStreamStatus } from "@/services/liveStream/types";

export interface UseLiveStreamOptions {
  streamId?: string;
  autoConnect?: boolean;
  token?: string;
  onViewerCount?: (count: number) => void;
  onMetadata?: (metadata: Record<string, unknown>) => void;
}

export interface UseLiveStreamReturn {
  status: LiveStreamStatus;
  error: Error | null;
  viewerCount: number;
  metadata: Record<string, unknown> | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isStreaming: boolean;
  isConnected: boolean;
}

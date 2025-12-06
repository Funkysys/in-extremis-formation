import type { LiveStreamService } from "@/services/liveStream";
import type { LiveStreamStatus } from "@/services/liveStream/types";
import type { UseLiveStreamOptions } from "./types";

export async function connectToStream(
  videoElement: HTMLVideoElement,
  options: UseLiveStreamOptions,
  callbacks: {
    setStatus: (status: LiveStreamStatus) => void;
    setError: (error: Error | null) => void;
    setViewerCount: (count: number) => void;
    setMetadata: (metadata: Record<string, unknown> | null) => void;
  },
  service: LiveStreamService
) {
  if (!options.streamId) {
    throw new Error("streamId est requis pour établir la connexion");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const wsBaseUrl = baseUrl.replace("http", "ws");
  const wsUrl = `${wsBaseUrl}/live/ws/stream/${options.streamId}`;

  console.log("🎥 Viewer connecting to stream:", options.streamId);
  console.log("🎯 URL WebSocket:", wsUrl);
  console.log("🔑 Token présent:", !!options.token);

  await service.startStream(
    videoElement,
    {
      wsUrl,
      token: options.token,
      mimeType: 'video/webm; codecs="vp8, opus"',
    },
    {
      onStatusChange: callbacks.setStatus,
      onError: callbacks.setError,
      onViewerCount: (count) => {
        callbacks.setViewerCount(count);
        options.onViewerCount?.(count);
      },
      onMetadata: (meta) => {
        callbacks.setMetadata(meta);
        options.onMetadata?.(meta);
      },
    }
  );
}

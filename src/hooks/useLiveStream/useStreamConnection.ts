import type { LiveStreamService } from "@/services/liveStream";
import type { LiveStreamStatus } from "@/services/liveStream/types";
import { useCallback } from "react";
import { connectToStream } from "./connection";
import type { UseLiveStreamOptions } from "./types";

export function useStreamConnection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  optionsRef: React.MutableRefObject<UseLiveStreamOptions>,
  hasConnected: React.MutableRefObject<boolean>,
  status: LiveStreamStatus,
  callbacks: {
    setStatus: (status: LiveStreamStatus) => void;
    setError: (error: Error | null) => void;
    setViewerCount: (count: number) => void;
    setMetadata: (metadata: Record<string, unknown> | null) => void;
  },
  service: LiveStreamService
) {
  const connect = useCallback(async () => {
    if (!videoRef.current) {
      const err = new Error("Référence vidéo non disponible");
      callbacks.setError(err);
      throw err;
    }

    if (hasConnected.current && status !== "disconnected") {
      console.warn("⚠️ Déjà connecté, status:", status);
      return;
    }

    console.log("🚀 Tentative de connexion, status actuel:", status);

    try {
      callbacks.setError(null);
      hasConnected.current = true;

      await connectToStream(
        videoRef.current,
        optionsRef.current,
        {
          setStatus: callbacks.setStatus,
          setError: callbacks.setError,
          setViewerCount: callbacks.setViewerCount,
          setMetadata: callbacks.setMetadata,
        },
        service
      );
    } catch (err) {
      console.error("❌ Erreur lors de la connexion:", err);
      hasConnected.current = false;
      callbacks.setError(err as Error);
      callbacks.setStatus("disconnected");
      throw err;
    }
  }, [videoRef, status, optionsRef, hasConnected, callbacks, service]);

  const disconnect = useCallback(() => {
    service.stopStream();
    hasConnected.current = false;
    callbacks.setStatus("disconnected");
    callbacks.setViewerCount(0);
    callbacks.setMetadata(null);
  }, [hasConnected, callbacks, service]);

  return { connect, disconnect };
}

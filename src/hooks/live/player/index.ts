/**
 * Hook React pour le streaming live via WebSocket
 */

import { LiveStreamService } from "@/services/liveStream";
import type { LiveStreamStatus } from "@/services/liveStream/types";
import { useEffect, useRef, useState } from "react";
import type { UseLiveStreamOptions, UseLiveStreamReturn } from "./types";
import { useStreamConnection } from "./useStreamConnection";

export type { UseLiveStreamOptions, UseLiveStreamReturn };

export function useLiveStream(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseLiveStreamOptions = {}
): UseLiveStreamReturn {
  const [status, setStatus] = useState<LiveStreamStatus>("disconnected");
  const [error, setError] = useState<Error | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(
    null
  );
  const hasConnected = useRef(false);
  const optionsRef = useRef(options);

  // Créer une instance fraîche du service - useMemo garantit une seule instance par mount
  const serviceRef = useRef<LiveStreamService>(new LiveStreamService());

  // Créer une nouvelle instance à chaque mount (après unmount)
  useEffect(() => {
    console.log("✨ useLiveStream mounted, service créé");
    serviceRef.current = new LiveStreamService();

    return () => {
      console.log("🧹 useLiveStream unmounted, cleanup service");
      serviceRef.current.stopStream();
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const { connect, disconnect } = useStreamConnection(
    videoRef,
    optionsRef,
    hasConnected,
    status,
    { setStatus, setError, setViewerCount, setMetadata },
    serviceRef.current!
  );

  useEffect(() => {
    let isMounted = true;
    let connectTimeout: NodeJS.Timeout;

    if (optionsRef.current.autoConnect && !hasConnected.current && isMounted) {
      console.log(
        "⏳ useLiveStream: Debounce de 2 secondes avant connexion..."
      );
      connectTimeout = setTimeout(() => {
        if (isMounted && !hasConnected.current) {
          console.log(
            "🎬 useLiveStream: Tentative de connexion après debounce (2s)"
          );
          connect().catch(console.error);
        } else {
          console.log(
            "⚠️ useLiveStream: Connexion annulée (déjà connecté ou démonté)"
          );
        }
      }, 2000);
    }

    return () => {
      isMounted = false;
      clearTimeout(connectTimeout);
      // Ne pas disconnect pendant React Strict Mode double mount
      // Le cleanup sera fait au vrai unmount du composant parent
      console.log(
        "🔌 useLiveStream: Cleanup (pas de disconnect pour éviter le double mount)"
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    error,
    viewerCount,
    metadata,
    connect,
    disconnect,
    isStreaming: status === "streaming",
    isConnected: status === "connected" || status === "streaming",
  };
}

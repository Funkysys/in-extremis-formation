/**
 * Hook pour gérer tout le cycle du broadcast
 */

import { useCallback, useRef, useState } from "react";
import { cleanupBroadcast } from "./cleanup";
import { captureMediaSource, getResolution } from "./mediaCapture";
import { createMediaRecorder } from "./recorder";
import type { StartBroadcastOptions } from "./types";
import { connectWebSocket, sendBroadcastMetadata } from "./websocket";

export type { SourceType } from "./types";

export function useLiveBroadcast() {
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const isStartingRef = useRef(false);

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const startBroadcast = useCallback(
    async (options: StartBroadcastOptions): Promise<MediaStream> => {
      if (
        isStartingRef.current ||
        wsRef.current?.readyState === WebSocket.OPEN
      ) {
        console.log("⚠️ Broadcast déjà en cours, ignoré");
        return streamRef.current!;
      }

      isStartingRef.current = true;

      try {
        const stream = await captureMediaSource(
          options.sourceType,
          options.deviceId
        );
        streamRef.current = stream;

        const ws = await connectWebSocket(options.streamId, options.token);
        wsRef.current = ws;

        ws.onclose = () => setIsBroadcasting(false);

        const resolution = getResolution(options.sourceType);
        sendBroadcastMetadata(ws, resolution);

        const recorder = createMediaRecorder(stream, options.bitrate, wsRef);
        recorderRef.current = recorder;

        setIsBroadcasting(true);
        isStartingRef.current = false;
        console.log("✅ Broadcast démarré !");

        return stream;
      } catch (error) {
        cleanupBroadcast({ wsRef, streamRef, recorderRef, isStartingRef });
        throw error;
      }
    },
    []
  );

  const stopBroadcast = useCallback(() => {
    console.log("⏹️ Arrêt broadcast");
    cleanupBroadcast({ wsRef, streamRef, recorderRef, isStartingRef });
    setIsBroadcasting(false);
  }, []);

  return { startBroadcast, stopBroadcast, isBroadcasting };
}

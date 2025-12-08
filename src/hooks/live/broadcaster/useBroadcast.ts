/**
 * Hook orchestrateur pour le broadcast live
 * Responsabilité : Coordination des hooks spécialisés
 */

import { useState } from "react";
import { useBroadcastRecorder } from "./useBroadcastRecorder";
import { SourceType, useBroadcastStream } from "./useBroadcastStream";
import { useBroadcastWebSocket } from "./useBroadcastWebSocket";

interface UseBroadcastOptions {
  streamId: string;
  token?: string;
  selectedDevice: string;
  sourceType: SourceType;
  bitrate: number;
}

export function useBroadcast({
  streamId,
  token,
  selectedDevice,
  sourceType,
  bitrate,
}: UseBroadcastOptions) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamHook = useBroadcastStream({ selectedDevice, sourceType });
  const wsHook = useBroadcastWebSocket();
  const recorderHook = useBroadcastRecorder();

  const start = async (videoElement: HTMLVideoElement | null) => {
    try {
      setError(null);
      console.log("🎬 Démarrage broadcast...");

      // 1. Capturer le stream
      const stream = await streamHook.captureStream();

      // 2. Afficher preview
      if (videoElement) {
        console.log(
          "🎥 Stream tracks:",
          stream
            .getTracks()
            .map((t) => `${t.kind}: ${t.enabled ? "active" : "disabled"}`)
        );
        videoElement.srcObject = stream;
        await videoElement.play();
        console.log("▶️ Video playing, readyState:", videoElement.readyState);
      }

      // 3. Connecter WebSocket
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const wsUrl = `${baseUrl.replace(
        "http",
        "ws"
      )}/live/ws/stream/${streamId}?role=streamer&token=${token}`;

      await wsHook.connect(wsUrl);

      // 4. Envoyer metadata
      const resolution =
        sourceType === "audio"
          ? "audio-only"
          : sourceType === "screen"
          ? "1080p"
          : "720p";
      wsHook.send(
        JSON.stringify({
          type: "broadcast_start",
          data: { resolution, fps: 30, codec: "vp8" },
        })
      );

      // 5. Démarrer l'enregistrement
      recorderHook.startRecording(stream, bitrate, (data: Blob) => {
        wsHook.send(data);
      });

      setIsBroadcasting(true);
      console.log("✅ Broadcast actif");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("❌ Erreur broadcast:", message);
      setError(message);
      stop();
      throw err;
    }
  };

  const stop = () => {
    console.log("⏹️ Arrêt broadcast");
    recorderHook.stopRecording();
    wsHook.disconnect();
    streamHook.stopStream();
    setIsBroadcasting(false);
  };

  return {
    isBroadcasting,
    error,
    start,
    stop,
  };
}

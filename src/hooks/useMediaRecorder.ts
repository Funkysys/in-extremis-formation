/**
 * Hook pour gérer le MediaRecorder et l'encodage vidéo
 */

import { useCallback, useRef } from "react";

interface UseMediaRecorderOptions {
  stream: MediaStream | null;
  getWebSocket: () => WebSocket | null;
  bitrate?: number;
  onError?: (error: Event) => void;
}

interface UseMediaRecorderReturn {
  mediaRecorder: MediaRecorder | null;
  start: (customBitrate?: number) => void;
  stop: () => void;
  isRecording: boolean;
}

export function useMediaRecorder(
  options: UseMediaRecorderOptions
): UseMediaRecorderReturn {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkCountRef = useRef(0);

  const start = useCallback(
    (customBitrate?: number) => {
      const ws = options.getWebSocket();
      if (!options.stream || !ws) {
        console.error("❌ Stream ou WebSocket manquant");
        return;
      }

      const mediaRecorder = new MediaRecorder(options.stream, {
        mimeType: "video/webm; codecs=vp8,opus",
        videoBitsPerSecond: customBitrate || options.bitrate || 2500000,
      });

      mediaRecorderRef.current = mediaRecorder;
      chunkCountRef.current = 0;

      mediaRecorder.ondataavailable = (event) => {
        const currentWs = options.getWebSocket();
        if (event.data.size > 0 && currentWs?.readyState === WebSocket.OPEN) {
          chunkCountRef.current++;

          if (chunkCountRef.current === 1) {
            console.log("📦 Premier chunk envoyé:", event.data.size, "bytes");
          }
          if (chunkCountRef.current % 50 === 0) {
            console.log(`📊 ${chunkCountRef.current} chunks envoyés`);
          }

          currentWs.send(event.data);
        } else if (currentWs?.readyState !== WebSocket.OPEN) {
          console.warn("⚠️ WebSocket non ouvert, chunk ignoré");
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ Erreur MediaRecorder:", event);
        options.onError?.(event);
      };

      mediaRecorder.onstart = () => {
        console.log("🎥 MediaRecorder démarré");
      };

      mediaRecorder.onstop = () => {
        console.log("⏹️ MediaRecorder arrêté");
      };

      // Chunk toutes les 100ms pour faible latence
      mediaRecorder.start(100);
    },
    [options]
  );

  const stop = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Arrêt MediaRecorder...");
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  }, []);

  return {
    mediaRecorder: mediaRecorderRef.current,
    start,
    stop,
    isRecording: mediaRecorderRef.current?.state === "recording",
  };
}

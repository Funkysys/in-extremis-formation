/**
 * Hook pour capturer caméra/écran/audio
 */

import { useCallback, useRef, useState } from "react";

type SourceType = "camera" | "screen" | "audio";

export function useMediaStream() {
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = useCallback(
    async (sourceType: SourceType, deviceId?: string): Promise<MediaStream> => {
      let stream: MediaStream;

      if (sourceType === "audio") {
        stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
      } else if (sourceType === "screen") {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080 },
          audio: false,
        });
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        stream = new MediaStream([
          ...displayStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId
            ? { deviceId, width: 1280, height: 720 }
            : { width: 1280, height: 720 },
          audio: true,
        });
      }

      streamRef.current = stream;
      setIsCapturing(true);
      return stream;
    },
    []
  );

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setIsCapturing(false);
    }
  }, []);

  return { startCapture, stopCapture, isCapturing, streamRef };
}

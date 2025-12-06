/**
 * Hook pour gérer la capture média (getUserMedia / getDisplayMedia)
 */

import { useCallback, useRef } from "react";

export type CaptureSource = "camera" | "screen" | "device";

interface UseMediaCaptureOptions {
  audioEnabled?: boolean;
}

interface UseMediaCaptureReturn {
  stream: MediaStream | null;
  captureCamera: (deviceId?: string) => Promise<MediaStream>;
  captureScreen: () => Promise<MediaStream>;
  stopCapture: () => void;
  toggleAudio: () => void;
}

export function useMediaCapture(
  options: UseMediaCaptureOptions = {}
): UseMediaCaptureReturn {
  const streamRef = useRef<MediaStream | null>(null);
  const audioEnabledRef = useRef(options.audioEnabled ?? true);

  const captureCamera = useCallback(
    async (deviceId?: string): Promise<MediaStream> => {
      const constraints = deviceId
        ? {
            video: {
              deviceId: { exact: deviceId },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 30 },
            },
            audio: audioEnabledRef.current,
          }
        : {
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
            audio: audioEnabledRef.current,
          };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      return stream;
    },
    []
  );

  const captureScreen = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: audioEnabledRef.current,
    });
    streamRef.current = stream;
    return stream;
  }, []);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      console.log("Arrêt des tracks média...");
      streamRef.current.getTracks().forEach((track) => {
        console.log("Track arrêté:", track.kind, track.label);
        track.stop();
      });
      streamRef.current = null;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
        audioEnabledRef.current = track.enabled;
      });
    }
  }, []);

  return {
    stream: streamRef.current,
    captureCamera,
    captureScreen,
    stopCapture,
    toggleAudio,
  };
}

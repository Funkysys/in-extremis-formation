/**
 * Hook pour capturer les flux média (caméra/écran/audio)
 * Responsabilité : Capture MediaStream uniquement
 */

import { useRef } from "react";

export type SourceType = "camera" | "screen" | "audio";

interface UseBroadcastStreamOptions {
  selectedDevice: string;
  sourceType: SourceType;
}

export function useBroadcastStream({
  selectedDevice,
  sourceType,
}: UseBroadcastStreamOptions) {
  const streamRef = useRef<MediaStream | null>(null);

  const captureAudio = async (): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  };

  const captureScreen = async (): Promise<MediaStream> => {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1920, height: 1080 },
      audio: false,
    });
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    return new MediaStream([
      ...displayStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);
  };

  const captureCamera = async (): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      video: selectedDevice
        ? { deviceId: selectedDevice, width: 1280, height: 720 }
        : { width: 1280, height: 720 },
      audio: true,
    });
  };

  const captureStream = async (): Promise<MediaStream> => {
    let stream: MediaStream;

    switch (sourceType) {
      case "audio":
        stream = await captureAudio();
        break;
      case "screen":
        stream = await captureScreen();
        break;
      default:
        stream = await captureCamera();
    }

    streamRef.current = stream;
    return stream;
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return {
    streamRef,
    captureStream,
    stopStream,
  };
}

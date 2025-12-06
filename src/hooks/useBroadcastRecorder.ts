/**
 * Hook pour enregistrer et streamer le MediaStream
 */

import { useCallback, useRef, useState } from "react";

export function useBroadcastRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(
    (stream: MediaStream, bitrate: number, onData: (blob: Blob) => void) => {
      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8,opus",
        videoBitsPerSecond: bitrate,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onData(event.data);
        }
      };

      recorder.start(100); // Chunk toutes les 100ms
      recorderRef.current = recorder;
      setIsRecording(true);
    },
    []
  );

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
      setIsRecording(false);
    }
  }, []);

  return { startRecording, stopRecording, isRecording };
}

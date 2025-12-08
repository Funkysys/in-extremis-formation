/**
 * Crée et démarre le MediaRecorder
 */
export function createMediaRecorder(
  stream: MediaStream,
  bitrate: number,
  wsRef: React.MutableRefObject<WebSocket | null>
): MediaRecorder {
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp8,opus",
    videoBitsPerSecond: bitrate,
  });

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(event.data);
    }
  };

  recorder.start(100);
  return recorder;
}

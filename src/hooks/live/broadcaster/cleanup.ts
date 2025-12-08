/**
 * Nettoie toutes les ressources du broadcast
 */
export function cleanupBroadcast(refs: {
  wsRef: React.MutableRefObject<WebSocket | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  recorderRef: React.MutableRefObject<MediaRecorder | null>;
  isStartingRef: React.MutableRefObject<boolean>;
}): void {
  refs.isStartingRef.current = false;

  if (refs.recorderRef.current) {
    refs.recorderRef.current.stop();
    refs.recorderRef.current = null;
  }

  if (refs.wsRef.current) {
    refs.wsRef.current.close();
    refs.wsRef.current = null;
  }

  if (refs.streamRef.current) {
    refs.streamRef.current.getTracks().forEach((t) => t.stop());
    refs.streamRef.current = null;
  }
}

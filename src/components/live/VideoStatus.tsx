/**
 * Messages de status vidéo
 * Responsabilité : Affichage des états (connexion, erreur, etc.)
 */

interface VideoStatusProps {
  status: "connecting" | "connected" | "streaming" | "disconnected" | "error";
  error: string | null;
  useWebSocket: boolean;
  onRetry?: () => void;
  onPlay?: () => void;
}

export function VideoStatus({
  status,
  error,
  useWebSocket,
  onRetry,
  onPlay,
}: VideoStatusProps) {
  const shouldShow = error || (useWebSocket && status !== "streaming");

  if (!shouldShow) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-center text-white">
        {useWebSocket && status === "connecting" && (
          <>
            <div className="text-4xl mb-4 animate-pulse">🔄</div>
            <p className="text-lg">Connexion au stream live...</p>
          </>
        )}
        {useWebSocket && status === "connected" && (
          <>
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <p className="text-lg">En attente du stream...</p>
          </>
        )}
        {error && (
          <>
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg">{error}</p>
            {!useWebSocket && onPlay && (
              <button
                onClick={onPlay}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                ▶️ Démarrer le stream
              </button>
            )}
            {useWebSocket && onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                🔄 Réessayer
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

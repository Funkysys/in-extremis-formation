export function LoadingState({ className }: { className: string }) {
  return (
    <div
      className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="animate-pulse text-gray-500">
        Chargement de la vidéo...
      </div>
    </div>
  );
}

export function ErrorState({
  error,
  retry,
  className,
}: {
  error: string;
  retry: () => void;
  className: string;
}) {
  return (
    <div
      className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="text-red-500 text-center p-4">
        <p>Impossible de charger la vidéo</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export function NoVideoIdState({ className }: { className: string }) {
  return (
    <div
      className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="text-red-500 text-center p-4">
        <p>Erreur: Aucun identifiant de vidéo fourni</p>
      </div>
    </div>
  );
}

export function PreparingState({ className }: { className: string }) {
  return (
    <div
      className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="text-gray-500 text-center p-4">
        <p>Préparation du streaming...</p>
      </div>
    </div>
  );
}

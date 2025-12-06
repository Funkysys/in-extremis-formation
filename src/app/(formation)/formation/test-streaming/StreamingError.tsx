interface StreamingErrorProps {
  error: string;
  onRetry: () => void;
}

export function StreamingError({ error, onRetry }: StreamingErrorProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 text-red-800 dark:text-red-300 rounded-lg p-4">
      <p className="font-semibold">Erreur</p>
      <p className="text-sm">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Réessayer
      </button>
    </div>
  );
}

interface StreamingInfoProps {
  streamUrl: string;
  method: string;
  currentQuality: string;
}

export function StreamingInfo({
  streamUrl,
  method,
  currentQuality,
}: StreamingInfoProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Configuration de streaming</h3>
      <dl className="text-sm space-y-1">
        <dt className="font-medium">Méthode:</dt>
        <dd className="mb-2">
          <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
            {method?.toUpperCase()}
          </span>
        </dd>
        <dt className="font-medium">Qualité actuelle:</dt>
        <dd className="mb-2">{currentQuality}</dd>
        <dt className="font-medium">URL:</dt>
        <dd className="break-all text-xs text-gray-600 dark:text-gray-400">
          {streamUrl}
        </dd>
      </dl>
    </div>
  );
}

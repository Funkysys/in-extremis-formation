export function StreamingDocumentation() {
  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">📚 Documentation</h2>

      <div className="space-y-4 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Endpoints disponibles:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                GET /stream/video/{"{id}"}/manifest.m3u8
              </code>
              - Manifest HLS
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                GET /stream/video/{"{id}"}
              </code>
              - Streaming direct avec Range requests
            </li>
            <li>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                GET /stream/video/{"{id}"}/quality/{"{quality}"}
              </code>
              - Streaming avec qualité spécifique
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Méthodes de streaming:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              <strong>HLS (HTTP Live Streaming):</strong> Prioritaire si
              supporté. Qualité adaptative, meilleure pour les connexions
              variables.
            </li>
            <li>
              <strong>Direct Streaming:</strong> Fallback avec Range requests.
              Compatible tous navigateurs, seek rapide.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Support navigateur:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Safari: HLS natif (application/vnd.apple.mpegurl)</li>
            <li>
              Chrome/Firefox/Edge: HLS via hls.js (Media Source Extensions)
            </li>
            <li>Tous: Direct streaming avec Range requests (fallback)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface StreamingConfigProps {
  videoId: string;
  selectedQuality: string;
  availableQualities: string[];
  onVideoIdChange: (id: string) => void;
  onQualityChange: (quality: string) => void;
  hasStreamUrl: boolean;
}

export function StreamingConfig({
  videoId,
  selectedQuality,
  availableQualities,
  onVideoIdChange,
  onQualityChange,
  hasStreamUrl,
}: StreamingConfigProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Configuration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">ID de la vidéo</label>
        <input
          type="text"
          value={videoId}
          onChange={(e) => onVideoIdChange(e.target.value)}
          placeholder="Entrez l'ID de la vidéo"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Exemple: test-video-123</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Qualité</label>
        <select
          value={selectedQuality}
          onChange={(e) => onQualityChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {availableQualities.map((quality) => (
            <option key={quality} value={quality}>
              {quality === "auto" ? "Automatique" : quality}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

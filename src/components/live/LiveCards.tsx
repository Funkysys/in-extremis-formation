interface LiveStream {
  streamId: string;
  title?: string;
  description?: string;
  streamerUsername?: string;
  streamerId?: number;
  isActive: boolean;
  viewerCount: number;
  startedAt?: string;
}

interface LiveCardProps {
  live: LiveStream;
}

export function ActiveLiveCard({ live }: LiveCardProps) {
  return (
    <div className="relative overflow-hidden transition-transform bg-gray-800 border border-gray-700 rounded-lg hover:scale-105 group">
      <div className="relative flex items-center justify-center h-48 bg-black">
        <div className="text-6xl">🎥</div>
        <div className="absolute flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-lg top-3 left-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          EN DIRECT
        </div>
        <div className="absolute flex items-center gap-1 px-2 py-1 text-sm text-white bg-black bg-opacity-75 rounded-lg top-3 right-3">
          <span>👁️</span>
          <span className="font-semibold">{live.viewerCount}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-white line-clamp-2">
          {live.title || live.streamId}
        </h3>
        <p className="text-sm text-gray-400">
          👨‍🏫 {live.streamerUsername || "Anonyme"}
        </p>
        {live.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {live.description}
          </p>
        )}
        {live.startedAt && (
          <p className="mt-1 text-xs text-gray-500">
            Démarré il y a{" "}
            {Math.floor(
              (Date.now() - new Date(live.startedAt).getTime()) / 60000
            )}{" "}
            min
          </p>
        )}
      </div>
    </div>
  );
}

export function PastLiveCard({ live }: LiveCardProps) {
  return (
    <div className="overflow-hidden transition-transform bg-gray-800 border border-gray-700 rounded-lg hover:scale-105">
      <div className="relative flex items-center justify-center h-32 bg-black">
        <div className="text-4xl">🎬</div>
      </div>
      <div className="p-3">
        <h3 className="mb-1 text-sm font-semibold text-white line-clamp-2">
          {live.title || live.streamId}
        </h3>
        <p className="text-xs text-gray-400">
          {live.streamerUsername || "Anonyme"}
        </p>
      </div>
    </div>
  );
}

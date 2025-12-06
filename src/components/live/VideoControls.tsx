/**
 * Contrôles vidéo
 * Responsabilité : Barre de contrôle player uniquement
 */

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  selectedQuality: "auto" | "1080p" | "720p" | "480p";
  showQualityMenu: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleQualityMenu: () => void;
  onQualityChange: (quality: "auto" | "1080p" | "720p" | "480p") => void;
  onTogglePiP: () => void;
  onToggleFullscreen: () => void;
}

export function VideoControls({
  isPlaying,
  isMuted,
  volume,
  selectedQuality,
  showQualityMenu,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleQualityMenu,
  onQualityChange,
  onTogglePiP,
  onToggleFullscreen,
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          className="text-white hover:text-red-500 transition-colors text-2xl p-2 hover:bg-white/10 rounded"
          title={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="text-white hover:text-red-500 transition-colors text-xl p-2 hover:bg-white/10 rounded"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={onVolumeChange}
            className="w-20 accent-red-600 cursor-pointer"
            title="Volume"
          />
        </div>

        {/* Indicateur LIVE */}
        <div className="flex-1 flex justify-center">
          <span className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            EN DIRECT
          </span>
        </div>

        {/* Menu qualité */}
        <div className="relative">
          <button
            onClick={onToggleQualityMenu}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm border border-gray-600 transition-colors"
            title="Qualité vidéo"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">{selectedQuality}</span>
          </button>

          {showQualityMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
              {(["auto", "1080p", "720p", "480p"] as const).map((quality) => (
                <button
                  key={quality}
                  onClick={() => onQualityChange(quality)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedQuality === quality
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {quality === "auto" ? "🔄 Automatique" : `📺 ${quality}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Picture-in-Picture */}
        <button
          onClick={onTogglePiP}
          className="text-white hover:text-red-500 transition-colors text-xl p-2 hover:bg-white/10 rounded hidden sm:block"
          title="Mini lecteur"
        >
          📺
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="text-white hover:text-red-500 transition-colors text-xl p-2 hover:bg-white/10 rounded"
          title="Plein écran"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}

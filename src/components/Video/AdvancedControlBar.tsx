/**
 * Barre de contrôles vidéo avancée
 * Responsabilité : UI contrôles uniquement
 */

import type { VideoQuality } from "@/services/videoStreamingService";
import {
  FiMaximize,
  FiPause,
  FiPlay,
  FiSettings,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";

interface AdvancedControlBarProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  showControls: boolean;
  showSettings: boolean;
  currentQuality?: VideoQuality;
  availableQualities?: VideoQuality[];
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleFullscreen: () => void;
  onToggleSettings: () => void;
  onQualityChange?: (quality: VideoQuality) => void;
}

export function AdvancedControlBar({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  buffered,
  showControls,
  showSettings,
  currentQuality,
  availableQualities = [],
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onToggleFullscreen,
  onToggleSettings,
  onQualityChange,
}: AdvancedControlBarProps) {
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity ${
        showControls ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Barre de progression */}
      <div className="mb-3">
        <div className="relative h-1 bg-gray-600 rounded-full cursor-pointer">
          <div
            className="absolute h-full bg-gray-400 rounded-full"
            style={{ width: `${bufferedPercentage}%` }}
          />
          <div
            className="absolute h-full bg-red-600 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-white">
        <button
          onClick={onTogglePlay}
          className="hover:text-red-500 transition-colors"
        >
          {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
        </button>

        <button
          onClick={onToggleMute}
          className="hover:text-red-500 transition-colors"
        >
          {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={onVolumeChange}
          className="w-20 accent-red-600"
        />

        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex-1" />

        {onQualityChange && availableQualities.length > 1 && (
          <div className="relative">
            <button
              onClick={onToggleSettings}
              className="hover:text-red-500 transition-colors"
            >
              <FiSettings size={20} />
            </button>
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 min-w-[120px]">
                <div className="text-sm font-semibold mb-2 px-2">Qualité</div>
                {availableQualities.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => onQualityChange(quality)}
                    className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-sm ${
                      quality === currentQuality ? "text-red-500" : ""
                    }`}
                  >
                    {quality === "auto" ? "Auto" : quality}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onToggleFullscreen}
          className="hover:text-red-500 transition-colors"
        >
          <FiMaximize size={20} />
        </button>
      </div>
    </div>
  );
}

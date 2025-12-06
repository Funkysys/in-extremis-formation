/**
 * Contrôles du broadcaster (boutons de démarrage/arrêt)
 */

import {
  FiMic,
  FiMicOff,
  FiMonitor,
  FiStopCircle,
  FiVideo,
} from "react-icons/fi";

interface BroadcasterControlsProps {
  isBroadcasting: boolean;
  isConnected: boolean;
  audioEnabled: boolean;
  viewerCount: number;
  error: string | null;
  onStartCamera: () => void;
  onStartScreen: () => void;
  onStop: () => void;
  onToggleAudio: () => void;
}

export function BroadcasterControls({
  isBroadcasting,
  isConnected,
  audioEnabled,
  viewerCount,
  error,
  onStartCamera,
  onStartScreen,
  onStop,
  onToggleAudio,
}: BroadcasterControlsProps) {
  return (
    <div className="p-4 bg-gray-700">
      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm text-white">
            {isBroadcasting
              ? "Diffusion en cours"
              : isConnected
              ? "Connecté"
              : "Déconnecté"}
          </span>
        </div>

        {/* Audio toggle */}
        {isBroadcasting && (
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            title={audioEnabled ? "Couper le micro" : "Activer le micro"}
          >
            {audioEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
          </button>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Boutons */}
      {!isBroadcasting ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onStartCamera}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FiVideo size={20} />
            <span>Caméra par défaut</span>
          </button>
          <button
            onClick={onStartScreen}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FiMonitor size={20} />
            <span>Partage d&apos;écran</span>
          </button>
        </div>
      ) : (
        <button
          onClick={onStop}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
        >
          <FiStopCircle size={20} />
          <span>Arrêter la diffusion</span>
        </button>
      )}

      {/* Info */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        {!isBroadcasting
          ? "Autorisez l'accès à votre caméra ou écran pour commencer"
          : `${viewerCount} spectateur${viewerCount > 1 ? "s" : ""} connecté${
              viewerCount > 1 ? "s" : ""
            }`}
      </div>
    </div>
  );
}

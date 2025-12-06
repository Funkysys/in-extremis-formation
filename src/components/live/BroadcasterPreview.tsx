/**
 * Composant d'aperçu vidéo pour le broadcaster
 */

import { RefObject } from "react";

interface BroadcasterPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isBroadcasting: boolean;
  viewerCount: number;
}

export function BroadcasterPreview({
  videoRef,
  isBroadcasting,
  viewerCount,
}: BroadcasterPreviewProps) {
  return (
    <div className="relative aspect-video bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        muted
        playsInline
      />

      {/* Badge BROADCASTING */}
      {isBroadcasting && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          EN DIRECT
        </div>
      )}

      {/* Viewer count */}
      {isBroadcasting && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-black bg-opacity-75 text-white rounded-lg text-sm flex items-center gap-2">
          <span>👁️</span>
          <span className="font-semibold">{viewerCount}</span>
        </div>
      )}

      {/* Message si pas de stream */}
      {!isBroadcasting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">📹</div>
            <p className="text-xl">Prêt à diffuser</p>
            <p className="text-sm mt-2">Choisissez une source ci-dessous</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Prévisualisation du broadcast
 * Responsabilité : Affichage vidéo preview uniquement
 */

import { RefObject } from "react";

interface BroadcastPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isBroadcasting: boolean;
  sourceType: "camera" | "screen" | "audio";
}

export function BroadcastPreview({
  videoRef,
  isBroadcasting,
  sourceType,
}: BroadcastPreviewProps) {
  return (
    <div className="relative mb-4 bg-black aspect-video">
      <video
        ref={videoRef}
        className="object-contain w-full h-full"
        autoPlay
        muted
        playsInline
      />
      {!isBroadcasting && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="mb-4 text-6xl">
              {sourceType === "audio" ? "🎤" : "📹"}
            </div>
            <p>Prêt à diffuser</p>
          </div>
        </div>
      )}
      {isBroadcasting && sourceType === "audio" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center">
            <div className="mb-4 text-6xl animate-pulse">🎤</div>
            <p className="text-xl text-white">Audio en direct</p>
          </div>
        </div>
      )}
    </div>
  );
}

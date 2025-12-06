/**
 * Overlays vidéo (badges, status)
 * Responsabilité : Affichage des informations superposées
 */

interface VideoOverlayProps {
  streamMethod: "hls" | "native" | "direct" | "websocket";
  viewerCount: number;
  showDev?: boolean;
}

export function VideoOverlay({
  streamMethod,
  viewerCount,
  showDev = false,
}: VideoOverlayProps) {
  return (
    <>
      {/* Badge LIVE en haut */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold shadow-lg">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        LIVE
        {showDev && (
          <span className="ml-2 text-xs opacity-75">
            ({streamMethod.toUpperCase()})
          </span>
        )}
      </div>

      {/* Nombre de viewers en haut à droite */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-black bg-opacity-75 text-white rounded-lg text-sm flex items-center gap-2">
        <span>👁️</span>
        <span className="font-semibold">{viewerCount}</span>
      </div>
    </>
  );
}

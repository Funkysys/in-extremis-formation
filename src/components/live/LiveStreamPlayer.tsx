"use client";

import { useLivePlayer } from "@/hooks/live";
import {
  useHlsPlayer,
  useVideoControls,
  useVideoDebugLogger,
} from "@/hooks/video";
import { useEffect, useRef, useState } from "react";
import { VideoControls } from "./VideoControls";
import { VideoOverlay } from "./VideoOverlay";
import { VideoStatus } from "./VideoStatus";

interface LiveStreamPlayerProps {
  streamUrl?: string;
  useWebSocket?: boolean;
  streamId?: string;
  token?: string;
  className?: string;
  isHLS?: boolean;
}

export function LiveStreamPlayer({
  streamUrl,
  useWebSocket = false,
  streamId,
  token,
  className = "",
  isHLS = true,
}: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamMethod, setStreamMethod] = useState<
    "hls" | "native" | "direct" | "websocket"
  >("direct");
  const [selectedQuality, setSelectedQuality] = useState<
    "auto" | "1080p" | "720p" | "480p"
  >("auto");
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const debugLogger = useVideoDebugLogger();
  const controls = useVideoControls(videoRef);

  // Log de debug pour vérifier les props
  console.log("🎬 LiveStreamPlayer Props:", {
    streamId,
    useWebSocket,
    hasToken: !!token,
    streamUrl,
  });

  const liveStream = useLivePlayer(videoRef, {
    streamId: streamId || `stream-${Date.now()}`,
    autoConnect: useWebSocket,
    token,
    onViewerCount: (count) => console.log("👥 Viewers:", count),
  });

  // Log de l'état du stream
  console.log("📺 LiveStream State:", {
    status: liveStream.status,
    isStreaming: liveStream.isStreaming,
    isConnected: liveStream.isConnected,
    viewerCount: liveStream.viewerCount,
    error: liveStream.error?.message,
  });

  const { changeQuality } = useHlsPlayer({
    streamUrl,
    isHLS,
    videoElement: videoRef.current,
    enabled: !useWebSocket,
    onError: setError,
    onReady: setStreamMethod,
  });

  useEffect(() => {
    if (!useWebSocket) return;

    setStreamMethod("websocket");
    setError(liveStream.error?.message || null);

    // Log quand le stream devient actif, mais ne pas forcer play() ici
    // Le play() sera déclenché par l'événement canplay quand des données seront disponibles
    if (liveStream.isStreaming && videoRef.current) {
      const video = videoRef.current;

      console.log(
        "🎬 Stream actif (readyState:",
        video.readyState,
        "paused:",
        video.paused,
        "buffered:",
        video.buffered.length,
        ") - En attente de données pour démarrer..."
      );
    }
  }, [useWebSocket, liveStream.error, liveStream.isStreaming, videoRef]);

  const handleQualityChange = (quality: typeof selectedQuality) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);
    changeQuality(quality);
  };

  return (
    <div className={`relative w-full h-full bg-black group ${className}`}>
      {/* Vidéo */}
      <video
        ref={videoRef}
        className="object-contain w-full h-full"
        src={streamUrl}
        autoPlay
        playsInline
        muted={true}
        onError={(e) => {
          console.error("Erreur vidéo:", e);
          setError("Erreur de chargement du stream");
        }}
        onPlay={(e) => {
          debugLogger.onPlay(e.currentTarget);
          controls.setIsPlaying(true);
        }}
        onPause={() => {
          debugLogger.onPause();
          controls.setIsPlaying(false);
        }}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          debugLogger.onLoadedMetadata(video);
        }}
        onLoadedData={(e) => {
          const video = e.currentTarget;
          console.log("📦 loadeddata: Premières données chargées", {
            readyState: video.readyState,
            paused: video.paused,
            currentTime: video.currentTime,
          });
        }}
        onCanPlay={(e) => {
          const video = e.currentTarget;
          console.log("✅ canplay: Vidéo prête à jouer", {
            readyState: video.readyState,
            paused: video.paused,
            currentTime: video.currentTime,
          });
          // Si la vidéo est en pause, forcer play()
          if (useWebSocket && video.paused) {
            console.log("🔄 canplay: Forçage play() car vidéo en pause");
            video
              .play()
              .catch((err) => console.error("❌ play() failed:", err));
          }
        }}
        onCanPlayThrough={(e) => {
          console.log(
            "✅✅ canplaythrough: Lecture sans interruption possible",
            {
              readyState: e.currentTarget.readyState,
              paused: e.currentTarget.paused,
            }
          );
        }}
        onPlaying={() =>
          console.log("▶️ playing: La vidéo est en cours de lecture")
        }
        onWaiting={() => console.log("⏳ waiting: En attente de données...")}
        onStalled={() => console.log("🚫 stalled: Chargement bloqué")}
        onTimeUpdate={(e) => debugLogger.onTimeUpdate(e.currentTarget)}
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      <VideoStatus
        status={liveStream.status}
        error={error}
        useWebSocket={useWebSocket}
        onRetry={() => liveStream.connect()}
        onPlay={controls.togglePlay}
      />

      <VideoControls
        isPlaying={controls.isPlaying}
        isMuted={controls.isMuted}
        volume={controls.volume}
        selectedQuality={selectedQuality}
        showQualityMenu={showQualityMenu}
        onTogglePlay={controls.togglePlay}
        onToggleMute={controls.toggleMute}
        onVolumeChange={controls.handleVolumeChange}
        onToggleQualityMenu={() => setShowQualityMenu(!showQualityMenu)}
        onQualityChange={handleQualityChange}
        onTogglePiP={controls.togglePictureInPicture}
        onToggleFullscreen={controls.toggleFullscreen}
      />

      <VideoOverlay
        streamMethod={streamMethod}
        viewerCount={useWebSocket ? liveStream.viewerCount : 0}
        showDev={process.env.NODE_ENV === "development"}
      />
    </div>
  );
}

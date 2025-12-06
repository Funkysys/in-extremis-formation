/**
 * Player vidéo avancé avec support HLS et Direct Streaming
 * Responsabilité : Orchestration uniquement
 */

"use client";

import { useAdvancedHlsPlayer } from "@/hooks/useAdvancedHlsPlayer";
import { useAdvancedVideoControls } from "@/hooks/useAdvancedVideoControls";
import type { VideoQuality } from "@/services/videoStreamingService";
import { useState } from "react";
import { AdvancedControlBar } from "./AdvancedControlBar";

interface AdvancedVideoPlayerProps {
  streamUrl: string;
  method: "hls" | "direct";
  title?: string;
  poster?: string;
  autoplay?: boolean;
  availableQualities?: VideoQuality[];
  currentQuality?: VideoQuality;
  onQualityChange?: (quality: VideoQuality) => void;
  className?: string;
}

export function AdvancedVideoPlayer({
  streamUrl,
  method,
  title,
  poster,
  autoplay = false,
  availableQualities = ["auto", "1080p", "720p", "480p", "360p"],
  currentQuality = "auto",
  onQualityChange,
  className = "",
}: AdvancedVideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { videoRef: hlsVideoRef } = useAdvancedHlsPlayer({
    streamUrl,
    method,
    autoplay,
    onError: setError,
  });

  const controls = useAdvancedVideoControls();

  const handleQualityChange = (quality: VideoQuality) => {
    onQualityChange?.(quality);
    setShowSettings(false);
  };

  if (error) {
    return (
      <div
        className={`aspect-video bg-gray-900 flex items-center justify-center ${className}`}
      >
        <div className="text-red-500 text-center p-4">
          <p className="text-xl mb-2">⚠️</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={controls.containerRef}
      className={`relative bg-black group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={(el) => {
          (
            hlsVideoRef as React.MutableRefObject<HTMLVideoElement | null>
          ).current = el;
          (
            controls.videoRef as React.MutableRefObject<HTMLVideoElement | null>
          ).current = el;
        }}
        className="w-full h-full"
        poster={poster}
        onClick={controls.togglePlay}
        playsInline
      />

      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/75 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}

      <AdvancedControlBar
        isPlaying={controls.isPlaying}
        isMuted={controls.isMuted}
        volume={controls.volume}
        currentTime={controls.currentTime}
        duration={controls.duration}
        buffered={controls.buffered}
        showControls={showControls}
        showSettings={showSettings}
        currentQuality={currentQuality}
        availableQualities={availableQualities}
        onTogglePlay={controls.togglePlay}
        onToggleMute={controls.toggleMute}
        onVolumeChange={controls.handleVolumeChange}
        onSeek={controls.handleSeek}
        onToggleFullscreen={controls.toggleFullscreen}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onQualityChange={handleQualityChange}
      />

      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/75 text-white text-xs rounded">
          {method.toUpperCase()} | {currentQuality}
        </div>
      )}
    </div>
  );
}

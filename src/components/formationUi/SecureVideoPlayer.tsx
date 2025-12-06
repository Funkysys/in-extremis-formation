"use client";
import dynamic from "next/dynamic";
import "plyr-react/plyr.css";
import { useSecureVideo } from "./SecureVideoPlayer/useSecureVideo";
import {
  LoadingState,
  ErrorState,
  NoVideoIdState,
  PreparingState,
} from "./SecureVideoPlayer/PlayerStates";
import { QualityControls, MethodBadge } from "./SecureVideoPlayer/VideoControls";
import type { VideoQuality } from "@/services/videoStreamingService";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

interface SecureVideoPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

export function SecureVideoPlayer({
  videoId,
  title,
  thumbnailUrl,
  className = "",
}: SecureVideoPlayerProps) {
  const {
    streamUrl,
    method,
    isLoading,
    error,
    capabilities,
    availableQualities,
    currentQuality,
    handleQualityChange,
    retry,
  } = useSecureVideo(videoId);

  if (isLoading) return <LoadingState className={className} />;
  if (!videoId) return <NoVideoIdState className={className} />;
  if (error) return <ErrorState error={error} retry={retry} className={className} />;
  if (!streamUrl) return <PreparingState className={className} />;

  const sourceType = method === "hls" ? "application/x-mpegURL" : "video/mp4";

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <MethodBadge
        method={method}
        currentQuality={currentQuality}
        supportsHLS={capabilities?.supportsHLS || false}
      />
      <QualityControls
        availableQualities={availableQualities}
        currentQuality={currentQuality}
        onQualityChange={handleQualityChange}
      />
      <Plyr
        source={{
          type: "video",
          title,
          sources: [{ src: streamUrl, type: sourceType }],
          ...(thumbnailUrl && { poster: thumbnailUrl }),
        }}
        options={{
          autoplay: false,
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "download",
            "fullscreen",
          ],
          settings: ["captions", "quality", "speed"],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
          keyboard: { focused: true, global: true },
          tooltips: { controls: true, seek: true },
          fullscreen: { enabled: true, fallback: true, iosNative: true },
          quality: {
            default: currentQuality === "auto" ? undefined : parseInt(currentQuality),
            options: availableQualities.filter((q) => q !== "auto").map((q) => parseInt(q)),
            forced: true,
            onChange: (quality: number) => {
              const newQuality = `${quality}p` as VideoQuality;
              if (availableQualities.includes(newQuality)) {
                handleQualityChange(newQuality);
              }
            },
          },
          ratio: "16:9",
        }}
      />
    </div>
  );
}

export default SecureVideoPlayer;

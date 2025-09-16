"use client";

import { useRef, useState } from "react";
import { VideoChapterEditor } from "./VideoChapterEditor";

type VideoPlayerWithChaptersProps = {
  videoUrl: string;
  videoId: string;
  duration: number;
  className?: string;
};

export function VideoPlayerWithChapters({
  videoUrl,
  videoId,
  duration,
  className = "",
}: VideoPlayerWithChaptersProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Lecteur vidéo */}
      <div className="lg:col-span-2">
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        {/* Contrôles personnalisés */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentTime(newTime);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                }
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-20 text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Éditeur de chapitres */}
      <div className="lg:col-span-1">
        <VideoChapterEditor videoId={videoId} videoDuration={duration} />
      </div>
    </div>
  );
}

// Fonction utilitaire pour formater le temps (secondes en MM:SS)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

import { useToast } from "@/providers/ToastProvider";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface VideoPlayerMethods {
  play: () => Promise<void>;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  videoUrl: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onReplaceClick: () => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
}

export const VideoPlayer = forwardRef<VideoPlayerMethods, VideoPlayerProps>(
  (props, ref) => {
    const {
      videoUrl,
      currentTime,
      onTimeUpdate,
      onReplaceClick,
      isDragging,
      onDragOver,
      onDragLeave,
      onDrop,
      className = "",
    } = props;

    const videoRef = useRef<HTMLVideoElement>(null);
    const { showToast } = useToast();

    useImperativeHandle(ref, () => ({
      play: async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.play();
          } catch {
            showToast("Impossible de lire la vidéo", "error");
          }
        }
      },
      getCurrentTime: () => {
        return videoRef.current?.currentTime || 0;
      },
    }));

    useEffect(() => {
      if (
        videoRef.current &&
        Math.abs(videoRef.current.currentTime - currentTime) > 0.1
      ) {
        videoRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

    const handleTimeUpdate = useCallback(
      (e: React.SyntheticEvent<HTMLVideoElement>) => {
        if (e.currentTarget) {
          onTimeUpdate(e.currentTarget.currentTime);
        }
      },
      [onTimeUpdate]
    );

    return (
      <div
        className={`relative bg-black rounded-lg overflow-hidden ${className}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain bg-black"
          controls
          onTimeUpdate={handleTimeUpdate}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onReplaceClick();
          }}
          title="Replace video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: isDragging ? 1 : 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <div className="text-white text-center p-4">
            <p className="text-lg font-medium">Drop video here</p>
            <p className="text-sm text-gray-300">to replace current video</p>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

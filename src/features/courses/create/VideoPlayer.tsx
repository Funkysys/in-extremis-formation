import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface VideoPlayerProps {
  videoFile: File | null;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  onVideoLoaded?: () => void;
  className?: string;
}

export interface VideoPlayerRef {
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    { videoFile, currentTime = 0, onTimeUpdate, onVideoLoaded, className = "" },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
      if (videoFile) {
        const url = URL.createObjectURL(videoFile);
        setVideoUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        setVideoUrl(null);
      }
    }, [videoFile]);

    useEffect(() => {
      if (videoRef.current && currentTime !== undefined) {
        videoRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

    const handleTimeUpdate = () => {
      if (videoRef.current && onTimeUpdate) {
        onTimeUpdate(videoRef.current.currentTime);
      }
    };

    const handleVideoLoaded = () => {
      onVideoLoaded?.();
    };

    useImperativeHandle(
      ref,
      () => ({
        getCurrentTime: () => videoRef.current?.currentTime || 0,
        seekTo: (time: number) => {
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        },
      }),
      []
    );

    return (
      <div className={className}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full rounded-lg"
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleVideoLoaded}
          />
        ) : (
          <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">No video selected</p>
          </div>
        )}
      </div>
    );
  }
);
VideoPlayer.displayName = "VideoPlayer";

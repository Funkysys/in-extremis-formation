import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

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
  ({ videoFile, currentTime = 0, onTimeUpdate, onVideoLoaded, className = '' }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      if (videoFile) {
        const url = URL.createObjectURL(videoFile);
        setVideoUrl(url);
        setIsLoaded(false);
        
        return () => {
          URL.revokeObjectURL(url);
        };
      } else {
        setVideoUrl(null);
        setIsLoaded(false);
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
      setIsLoaded(true);
      onVideoLoaded?.();
    };

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      seekTo: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      }
    }), []);

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

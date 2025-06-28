import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { VideoPlayer, VideoPlayerRef } from './VideoPlayer';
import { VideoUploader, VideoUploaderRef } from './VideoUploader';
import { VideoMetadata } from '../types';

interface VideoSectionProps {
  videoFile: File | null;
  onVideoChange: (file: File | null) => void;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  className?: string;
}

export interface VideoSectionRef {
  uploadVideo: () => Promise<VideoMetadata | undefined>;
  getCurrentTime: () => number;
}

export const VideoSection = forwardRef<VideoSectionRef, VideoSectionProps>(
  ({ videoFile, onVideoChange, currentTime, onTimeUpdate, className = '' }, ref) => {
    const playerRef = useRef<VideoPlayerRef>(null);
    const uploaderRef = useRef<VideoUploaderRef>(null);

    useImperativeHandle(ref, () => ({
      uploadVideo: async () => {
        if (!uploaderRef.current) {
          console.error('Uploader reference not available');
          return undefined;
        }
        
        try {
          return await uploaderRef.current.upload();
        } catch (error) {
          console.error('Video upload error:', error);
          throw error;
        }
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0;
      }
    }), []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onVideoChange(file);
    };

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Course Video</h3>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {videoFile ? 'Change Video' : 'Select Video'}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <VideoPlayer
          ref={playerRef}
          videoFile={videoFile}
          currentTime={currentTime}
          onTimeUpdate={onTimeUpdate}
          className="w-full"
        />

        <VideoUploader
          ref={uploaderRef}
          videoFile={videoFile}
          className="hidden"
        />
      </div>
    );
  }
);

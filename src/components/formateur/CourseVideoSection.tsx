import React, { useRef, useCallback, useState } from 'react';
import { VideoChapter } from './types/create-course.types';
import { CourseVideoUpload, VideoPlayerMethods } from './CourseVideoUpload';
import { MediaCMSVideoUploader, VideoMetadata } from './MediaCMSVideoUploader';
import { CourseChapters } from './CourseChapters';
import { useToast } from '@/providers/ToastProvider';

interface VideoUploadResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
}

interface CourseVideoSectionProps {
  videoFile: File | null;
  onVideoChange: (file: File) => void;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  chapters: VideoChapter[];
  onAddChapter: (title: string, timestamp: number) => void;
  onUpdateChapter: (id: string, title: string) => void;
  onDeleteChapter: (id: string) => void;
  className?: string;
  sectionRef?: React.RefObject<{
    startVideoUpload: () => Promise<VideoUploadResult | undefined>;
  } | null>;
}
export const CourseVideoSection: React.FC<CourseVideoSectionProps> = ({
  videoFile,
  onVideoChange,
  currentTime,
  onTimeUpdate,
  chapters,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  className = '',
  sectionRef
}) => {
  const videoRef = useRef<VideoPlayerMethods | null>(null);
  const [videoTime, setVideoTime] = useState(0);
  const { showToast } = useToast();
  const uploaderRef = useRef<{ startUpload: () => Promise<VideoMetadata | undefined> }>(null);
  React.useEffect(() => {
    if (sectionRef && 'current' in sectionRef) {
      sectionRef.current = {
        startVideoUpload: async () => {
          console.log('CourseVideoSection: starting video upload');
          
          if (!uploaderRef.current) {
            console.log('CourseVideoSection: uploaderRef not available');
            return undefined;
          }
          
          try {
            return await uploaderRef.current.startUpload();
          } catch (error) {
            console.error('Upload error:', error);
            throw error;
          }
        }
      };
    }
  }, [sectionRef]);
  

  const handleTimeUpdate = useCallback((time: number) => {
    setVideoTime(time);
    onTimeUpdate(time);
  }, [onTimeUpdate]);
  

  const handleVideoUploaded = useCallback(() => {
    if (videoFile) {
      showToast("Video ready for chapter editing", "success");
    }
  }, [videoFile, showToast]);
  

  const getVideoTime = useCallback(() => {
    try {
      const videoElement = document.querySelector('video');
      return videoElement?.currentTime || videoTime;
    } catch (e) {
      return videoTime;
    }
  }, [videoTime]);


  const handleAddChapter = useCallback((title: string) => {
    const currentTime = getVideoTime();
    onAddChapter(title, currentTime);
    showToast(`Chapter added at ${formatTime(currentTime)}`, "success");
  }, [onAddChapter, getVideoTime, showToast]);


  const handleChapterClick = useCallback((timestamp: number) => {
    try {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.currentTime = timestamp;
        videoElement.play().catch(() => {
          showToast("Unable to play video", "error");
        });
      }
      setVideoTime(timestamp);
      onTimeUpdate(timestamp);
    } catch (error) {
      showToast("Unable to access video", "error");
    }
  }, [onTimeUpdate, showToast, setVideoTime]);

  return (
    <div className={`space-y-6 ${className}`}>
      <CourseVideoUpload
        ref={videoRef}
        videoFile={videoFile}
        onVideoChange={onVideoChange}
        onVideoUploaded={handleVideoUploaded}
        onTimeUpdate={handleTimeUpdate}
        currentTime={currentTime}
        uploaderRef={uploaderRef}
      />
      

      <MediaCMSVideoUploader
        ref={uploaderRef}
        videoFile={videoFile}
        onUploadComplete={() => {}}
        className="hidden"
      />
      
      <CourseChapters
        chapters={chapters}
        currentTime={videoTime}
        onChapterClick={handleChapterClick}
        onUpdateChapter={onUpdateChapter}
        onDeleteChapter={onDeleteChapter}
      />
    </div>
  );
};


const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

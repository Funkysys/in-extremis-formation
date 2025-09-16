// import supprimé : useToast
// import supprimé : useToast
import React, { useCallback, useRef, useState } from "react";
import { CourseChapters } from "./CourseChapters";
import CourseVideoUpload, { VideoPlayerMethods } from "./CourseVideoUpload";
// import supprimé : MediaCMSVideoUploader, VideoMetadata
import { VideoChapter } from "./types/create-course.types";

// interface VideoUploadResult supprimée

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
  // sectionRef supprimé
}
export const CourseVideoSection: React.FC<CourseVideoSectionProps> = ({
  videoFile,
  onVideoChange,
  currentTime,
  onTimeUpdate,
  chapters,
  // onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  className = "",
  // sectionRef supprimé
}) => {
  const videoRef = useRef<VideoPlayerMethods | null>(null);
  const [videoTime, setVideoTime] = useState(0);
  // showToast supprimé
  // Effet sectionRef supprimé (uploaderRef inutilisé)

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setVideoTime(time);
      onTimeUpdate(time);
    },
    [onTimeUpdate]
  );

  // handleVideoUploaded supprimé (onVideoUploaded inutilisé)

  // const getVideoTime = useCallback(() => {
  //   try {
  //     const videoElement = document.querySelector("video");
  //     return videoElement?.currentTime || videoTime;
  //   } catch {
  //     return videoTime;
  //   }
  // }, [videoTime]);

  // const handleAddChapter = useCallback((title: string) => {
  //   const currentTime = getVideoTime();
  //   onAddChapter(title, currentTime);
  //   showToast(`Chapter added at ${formatTime(currentTime)}`, "success");
  // }, [onAddChapter, getVideoTime, showToast]);

  // const handleChapterClick = useCallback((timestamp: number) => {
  //   try {
  //     const videoElement = document.querySelector('video');
  //     if (videoElement) {
  //       videoElement.currentTime = timestamp;
  //       videoElement.play().catch(() => {
  //         showToast("Unable to play video", "error");
  //       });
  //     }
  //     setVideoTime(timestamp);
  //     onTimeUpdate(timestamp);
  //   } catch (error) {
  //     showToast("Unable to access video", "error");
  //   }
  // }, [onTimeUpdate, showToast, setVideoTime]);

  return (
    <div className={`space-y-6 ${className}`}>
      <CourseVideoUpload
        ref={videoRef}
        videoFile={videoFile}
        onVideoChange={onVideoChange}
        onTimeUpdate={handleTimeUpdate}
        currentTime={currentTime}
      />

      {/* MediaCMSVideoUploader supprimé */}

      <CourseChapters
        chapters={chapters}
        currentTime={videoTime}
        // onChapterClick={handleChapterClick}
        onUpdateChapter={onUpdateChapter}
        onDeleteChapter={onDeleteChapter}
      />
    </div>
  );
};

// const formatTime = (seconds: number): string => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

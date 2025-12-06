import React, { forwardRef, useCallback, useRef } from "react";
import { UploadZone } from "./CourseVideoUpload/UploadZone";
import { useDragAndDrop } from "./CourseVideoUpload/useDragAndDrop";
import { useVideoFile } from "./CourseVideoUpload/useVideoFile";
import {
  VideoPlayer,
  VideoPlayerMethods,
} from "./CourseVideoUpload/VideoPlayer";

export type { VideoPlayerMethods };

interface CourseVideoUploadProps {
  videoFile: File | null;
  onVideoChange: (file: File) => void;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  className?: string;
}

const CourseVideoUpload = forwardRef<
  VideoPlayerMethods,
  CourseVideoUploadProps
>((props, ref) => {
  const {
    videoFile,
    onVideoChange,
    currentTime,
    onTimeUpdate,
    className = "",
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { videoUrl, validateAndSetFile } = useVideoFile(
    videoFile,
    onVideoChange
  );
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useDragAndDrop(validateAndSetFile);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        validateAndSetFile(e.target.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleReplaceClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (videoFile && videoUrl) {
    return (
      <>
        <VideoPlayer
          ref={ref}
          videoUrl={videoUrl}
          currentTime={currentTime}
          onTimeUpdate={onTimeUpdate}
          onReplaceClick={handleReplaceClick}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={className}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
      </>
    );
  }

  return (
    <UploadZone
      isDragging={isDragging}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onFileSelect={handleFileSelect}
      className={className}
    />
  );
});

CourseVideoUpload.displayName = "CourseVideoUpload";

export default CourseVideoUpload;

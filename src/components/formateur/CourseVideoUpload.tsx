import { useToast } from "@/providers/ToastProvider";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
// import supprimé : MediaCMSVideoUploader, VideoMetadata

export interface VideoPlayerMethods {
  play: () => Promise<void>;
  getCurrentTime: () => number;
}

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return url;
      });
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setVideoUrl("");
    }
  }, [videoFile]);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("video/")) {
        showToast("Please select a valid video file", "error");
        return;
      }
      if (file.size > 1024 * 1024 * 1024) {
        showToast("Video must not exceed 1 GB", "error");
        return;
      }
      onVideoChange(file);
      showToast("Video selected. Upload will occur when saving.", "info");
    },
    [onVideoChange, showToast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

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

  if (videoFile && videoUrl) {
    return (
      <div
        className={`relative bg-black rounded-lg overflow-hidden ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
            fileInputRef.current?.click();
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
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-900/20"
            : "border-gray-600 hover:border-blue-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-blue-400 hover:text-blue-300">
                Upload a video
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              MP4, WebM ou MOV (max. 100MB)
            </p>
          </div>
        </div>
      </div>
      {/* MediaCMSVideoUploader supprimé */}
    </div>
  );
});

CourseVideoUpload.displayName = "CourseVideoUpload";

export default CourseVideoUpload;
// ...ligne supprimée...

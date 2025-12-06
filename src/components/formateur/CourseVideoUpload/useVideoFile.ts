import { useToast } from "@/providers/ToastProvider";
import { useCallback, useEffect, useState } from "react";

export function useVideoFile(
  videoFile: File | null,
  onVideoChange: (file: File) => void
) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const { showToast } = useToast();

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

  return {
    videoUrl,
    validateAndSetFile,
  };
}

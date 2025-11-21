// Hook pour gérer le temps actuel de la vidéo

import { useEffect, useState } from "react";

export function useVideoTime(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [videoRef]);

  return currentTime;
}

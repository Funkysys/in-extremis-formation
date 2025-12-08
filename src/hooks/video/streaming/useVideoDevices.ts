/**
 * Hook pour énumérer et gérer les périphériques vidéo disponibles
 */

import { useEffect, useState } from "react";

export interface VideoDeviceInfo extends MediaDeviceInfo {
  isOBS?: boolean;
  isExternal?: boolean;
}

export function useVideoDevices() {
  const [devices, setDevices] = useState<VideoDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDevices = async () => {
      try {
        setIsLoading(true);
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices
          .filter((device) => device.kind === "videoinput")
          .map((device) => {
            const label = device.label.toLowerCase();
            return {
              ...device,
              isOBS: label.includes("obs") || label.includes("virtual"),
              isExternal: label.includes("usb") || label.includes("capture"),
            };
          });

        setDevices(videoDevices);
      } catch (err) {
        console.error("Erreur énumération périphériques:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getDevices();

    // Écouter les changements de périphériques
    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, []);

  return { devices, isLoading };
}

/**
 * Hook React pour gérer le streaming vidéo avec HLS et fallback
 */

import {
  StreamingMethod,
  VideoQuality,
  videoStreamingService,
} from "@/services/videoStreamingService";
import { useCallback, useEffect, useState } from "react";

interface UseVideoStreamingOptions {
  videoId: string;
  token: string;
  quality?: VideoQuality;
  autoQuality?: boolean;
}

interface UseVideoStreamingReturn {
  streamUrl: string | null;
  method: StreamingMethod | null;
  isLoading: boolean;
  error: string | null;
  capabilities: {
    supportsHLS: boolean;
    supportsMSE: boolean;
    supportsNativeHLS: boolean;
  } | null;
  availableQualities: VideoQuality[];
  currentQuality: VideoQuality;
  changeQuality: (quality: VideoQuality) => void;
  retry: () => void;
}

export function useVideoStreaming(
  options: UseVideoStreamingOptions
): UseVideoStreamingReturn {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [method, setMethod] = useState<StreamingMethod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capabilities, setCapabilities] =
    useState<UseVideoStreamingReturn["capabilities"]>(null);
  const [availableQualities, setAvailableQualities] = useState<VideoQuality[]>([
    "auto",
    "1080p",
    "720p",
    "480p",
    "360p",
  ]);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>(
    options.quality || "auto"
  );

  const initializeStream = useCallback(async () => {
    if (!options.videoId || !options.token) {
      setError("ID vidéo ou token manquant");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Détecter les capacités du navigateur
      const caps = videoStreamingService.detectCapabilities();
      setCapabilities(caps);

      // Récupérer les qualités disponibles
      try {
        const qualities = await videoStreamingService.getAvailableQualities(
          options.videoId,
          options.token
        );
        setAvailableQualities(qualities);
      } catch {
        console.warn(
          "Impossible de récupérer les qualités, utilisation des valeurs par défaut"
        );
      }

      // Générer l'URL optimale
      const streamConfig = videoStreamingService.getOptimalStreamUrl({
        videoId: options.videoId,
        token: options.token,
        quality: currentQuality,
      });

      // Tester l'URL
      const isAccessible = await videoStreamingService.testStreamUrl(
        streamConfig.url
      );

      if (!isAccessible) {
        // Fallback sur direct streaming si HLS échoue
        if (streamConfig.method === "hls") {
          console.warn("HLS non accessible, fallback sur direct streaming");
          const directUrl = videoStreamingService.getDirectUrl(
            options.videoId,
            options.token,
            currentQuality
          );
          setStreamUrl(directUrl);
          setMethod("direct");
        } else {
          throw new Error("Stream non accessible");
        }
      } else {
        setStreamUrl(streamConfig.url);
        setMethod(streamConfig.method);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Erreur initialisation stream:", err);
      setError(err instanceof Error ? err.message : "Erreur de streaming");
      setIsLoading(false);
    }
  }, [options.videoId, options.token, currentQuality]);

  useEffect(() => {
    initializeStream();
  }, [initializeStream]);

  const changeQuality = useCallback((quality: VideoQuality) => {
    setCurrentQuality(quality);
  }, []);

  const retry = useCallback(() => {
    initializeStream();
  }, [initializeStream]);

  return {
    streamUrl,
    method,
    isLoading,
    error,
    capabilities,
    availableQualities,
    currentQuality,
    changeQuality,
    retry,
  };
}

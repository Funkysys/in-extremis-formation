"use client";
import { GENERATE_VIDEO_TOKEN } from "@/graphql/queries/video-token-queries";
import { useVideoStreaming } from "@/hooks/useVideoStreaming";
import { useAuth } from "@/providers/AuthProvider";
import type { VideoQuality } from "@/services/videoStreamingService";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export function useSecureVideo(videoId: string) {
  const { user } = useAuth();
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("auto");

  const { data, error: tokenError } = useQuery<{
    generateVideoToken: { success: boolean; token: string; message?: string };
  }>(GENERATE_VIDEO_TOKEN, {
    variables: { videoId },
    skip: !user || !videoId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.generateVideoToken?.success) {
      setVideoToken(data.generateVideoToken.token);
    }
  }, [data]);

  const {
    streamUrl,
    method,
    isLoading: streamLoading,
    error: streamError,
    capabilities,
    availableQualities,
    currentQuality,
    changeQuality,
    retry,
  } = useVideoStreaming({
    videoId,
    token: videoToken || "",
    quality: selectedQuality,
  });

  const isLoading = !videoToken || streamLoading;
  const error =
    tokenError?.message ||
    streamError ||
    (data?.generateVideoToken && !data.generateVideoToken.success
      ? data.generateVideoToken.message ||
        "Erreur lors de la génération du token"
      : null);

  const handleQualityChange = (quality: VideoQuality) => {
    setSelectedQuality(quality);
    changeQuality(quality);
  };

  return {
    videoToken,
    streamUrl,
    method,
    isLoading,
    error,
    capabilities,
    availableQualities,
    currentQuality,
    handleQualityChange,
    retry,
  };
}

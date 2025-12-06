"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { AdvancedVideoPlayer } from "@/components/Video/AdvancedVideoPlayer";
import { GENERATE_VIDEO_TOKEN } from "@/graphql/queries/video-token-queries";
import { useVideoStreaming } from "@/hooks/useVideoStreaming";
import { useAuth } from "@/providers/AuthProvider";
import { VideoQuality } from "@/services/videoStreamingService";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { BrowserCapabilities } from "./BrowserCapabilities";
import { StreamingConfig } from "./StreamingConfig";
import { StreamingDocumentation } from "./StreamingDocumentation";
import { StreamingError } from "./StreamingError";
import { StreamingInfo } from "./StreamingInfo";

export default function TestStreamingPage() {
  const { user } = useAuth();
  const [testVideoId, setTestVideoId] = useState("");
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("auto");

  const { data: tokenData } = useQuery<{
    generateVideoToken: { success: boolean; token: string };
  }>(GENERATE_VIDEO_TOKEN, {
    variables: { videoId: testVideoId },
    skip: !testVideoId || !user,
    fetchPolicy: "network-only",
  });

  const token = tokenData?.generateVideoToken?.token || "";

  const {
    streamUrl,
    method,
    isLoading,
    error,
    capabilities,
    availableQualities,
    currentQuality,
    changeQuality,
    retry,
  } = useVideoStreaming({
    videoId: testVideoId,
    token,
    quality: selectedQuality,
  });

  const handleQualityChange = (quality: string) => {
    const videoQuality = quality as VideoQuality;
    setSelectedQuality(videoQuality);
    if (streamUrl) {
      changeQuality(videoQuality);
    }
  };

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Test Streaming Vidéo</h1>

        <StreamingConfig
          videoId={testVideoId}
          selectedQuality={selectedQuality}
          availableQualities={availableQualities}
          onVideoIdChange={setTestVideoId}
          onQualityChange={handleQualityChange}
          hasStreamUrl={!!streamUrl}
        />

        {capabilities && <BrowserCapabilities capabilities={capabilities} />}

        {streamUrl && method && (
          <StreamingInfo
            streamUrl={streamUrl}
            method={method}
            currentQuality={currentQuality}
          />
        )}

        {error && <StreamingError error={error} onRetry={retry} />}

        {isLoading && testVideoId && (
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement du stream...</p>
            </div>
          </div>
        )}

        {streamUrl && method && !isLoading && (
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            <AdvancedVideoPlayer
              streamUrl={streamUrl}
              method={method}
              title="Test Streaming"
              availableQualities={availableQualities}
              currentQuality={currentQuality}
              onQualityChange={handleQualityChange}
            />
          </div>
        )}

        {!testVideoId && (
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">📹</p>
              <p>Entrez un ID de vidéo pour commencer</p>
            </div>
          </div>
        )}

        <StreamingDocumentation />
      </div>
    </RequireAuth>
  );
}

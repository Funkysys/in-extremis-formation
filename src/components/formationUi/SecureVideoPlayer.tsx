"use client";

import { GENERATE_VIDEO_TOKEN } from "@/graphql/queries/video-token-queries";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import "plyr-react/plyr.css";
import { useEffect, useState } from "react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

interface SecureVideoPlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

export function SecureVideoPlayer({
  videoId,
  title,
  thumbnailUrl,
  className = "",
}: SecureVideoPlayerProps) {
  const { user } = useAuth();
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      setError(null);
      setIsLoading(false);
    } else if (data?.generateVideoToken) {
      setError(
        data.generateVideoToken.message ||
          "Erreur lors de la génération du token"
      );
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (tokenError) {
      setError("Erreur de connexion au serveur");
      setIsLoading(false);
    }
  }, [tokenError]);

  if (isLoading) {
    return (
      <div
        className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="animate-pulse text-gray-500">
          Chargement de la vidéo...
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div
        className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-red-500 text-center p-4">
          <p>Erreur: Aucun identifiant de vidéo fourni</p>
        </div>
      </div>
    );
  }

  if (error || !videoToken) {
    return (
      <div
        className={`aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-red-500 text-center p-4">
          <p>Impossible de charger la vidéo</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/stream/${videoId}?token=${videoToken}`;

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <Plyr
        source={{
          type: "video",
          title,
          sources: [
            {
              src: videoUrl,
              type: "video/mp4",
            },
          ],
          ...(thumbnailUrl && { poster: thumbnailUrl }),
        }}
        options={{
          autoplay: false,
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
        }}
      />
    </div>
  );
}

export default SecureVideoPlayer;

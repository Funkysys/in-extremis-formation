/**
 * Hook pour la gestion HLS avec hls.js
 * Responsabilité : Configuration et gestion du player HLS uniquement
 */

import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface UseHlsPlayerOptions {
  streamUrl?: string;
  isHLS?: boolean;
  videoElement: HTMLVideoElement | null;
  enabled: boolean;
  onError: (message: string) => void;
  onReady: (method: "hls" | "native" | "direct") => void;
}

export function useHlsPlayer({
  streamUrl,
  isHLS = true,
  videoElement,
  enabled,
  onError,
  onReady,
}: UseHlsPlayerOptions) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!enabled || !videoElement || !streamUrl) {
      return;
    }

    // Cleanup HLS si existant
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHLSUrl = streamUrl.includes(".m3u8") || isHLS;

    if (isHLSUrl) {
      // Support HLS natif (Safari)
      if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = streamUrl;
        onReady("native");
      }
      // hls.js pour les autres navigateurs
      else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          onReady("hls");
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Erreur réseau HLS, tentative de récupération");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Erreur média HLS, tentative de récupération");
                hls.recoverMediaError();
                break;
              default:
                onError("Erreur HLS fatale");
                hls.destroy();
                break;
            }
          }
        });
      } else {
        onError("HLS non supporté par ce navigateur");
      }
    } else {
      // Stream direct
      videoElement.src = streamUrl;
      onReady("direct");
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [enabled, videoElement, streamUrl, isHLS, onError, onReady]);

  const changeQuality = (quality: "auto" | "1080p" | "720p" | "480p") => {
    if (!hlsRef.current) return;

    if (quality === "auto") {
      hlsRef.current.currentLevel = -1;
    } else {
      const targetHeight = parseInt(quality);
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.height === targetHeight
      );
      if (levelIndex >= 0) {
        hlsRef.current.currentLevel = levelIndex;
      }
    }
  };

  return {
    hlsInstance: hlsRef.current,
    changeQuality,
  };
}

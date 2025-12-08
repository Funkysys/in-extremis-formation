/**
 * Hook pour gérer HLS.js
 * Responsabilité : Initialisation et gestion HLS uniquement
 */

import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface UseHlsPlayerOptions {
  streamUrl: string;
  method: "hls" | "direct";
  autoplay: boolean;
  onError: (error: string) => void;
}

export function useAdvancedHlsPlayer({
  streamUrl,
  method,
  autoplay,
  onError,
}: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;

    const video = videoRef.current;

    // Cleanup HLS existant
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHLSUrl = streamUrl.includes(".m3u8") || method === "hls";

    if (isHLSUrl) {
      // HLS natif (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        if (autoplay) {
          video.play().catch((err) => {
            console.error("Erreur autoplay:", err);
          });
        }
      }
      // HLS.js
      else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        });

        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoplay) {
            video.play().catch((err) => {
              console.error("Erreur autoplay:", err);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                onError("Erreur de chargement du stream");
                hls.destroy();
                break;
            }
          }
        });
      } else {
        onError("HLS non supporté");
      }
    } else {
      // Direct streaming
      video.src = streamUrl;
      if (autoplay) {
        video.play().catch((err) => {
          console.error("Erreur autoplay:", err);
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl, method, autoplay, onError]);

  return { videoRef, hlsRef };
}

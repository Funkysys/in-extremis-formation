"use client";

import { logger } from "@/services/logger";
import { ToastService } from "@/services/toastService";
import { useState } from "react";

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const share = async (data: ShareData) => {
    setIsSharing(true);

    try {
      if (canShare) {
        // Web Share API disponible (mobile/moderne)
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url,
        });

        logger.info("Partage réussi", "useShare", data);
      } else {
        // Fallback : copier dans le presse-papier
        await navigator.clipboard.writeText(data.url);
        ToastService.success("🔗 Lien copié dans le presse-papier");
        logger.info("Lien copié", "useShare", data);
      }
    } catch (error) {
      // L'utilisateur a annulé le partage ou une erreur s'est produite
      if ((error as Error).name !== "AbortError") {
        logger.error("Erreur partage", error, "useShare");
        ToastService.error("Erreur lors du partage");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    canShare,
    isSharing,
  };
};

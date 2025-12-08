import { logger } from "@/services/logger";
import { BeforeInstallPromptEvent, isAppInstalled } from "@/utils/pwaUtils";
import { useCallback, useEffect, useState } from "react";

export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isAppInstalled());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setInstallPrompt(event);
      setCanInstall(true);
      logger.info("Installation PWA disponible", "PWA");
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPrompt(null);
      logger.info("PWA installée", "PWA");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      logger.info("Choix installation PWA", "PWA", { outcome: choice.outcome });

      setInstallPrompt(null);
      setCanInstall(false);

      return choice.outcome === "accepted";
    } catch (error) {
      logger.error("Erreur installation PWA", error, "PWA");
      return false;
    }
  }, [installPrompt]);

  return {
    canInstall,
    isInstalled,
    install,
  };
}

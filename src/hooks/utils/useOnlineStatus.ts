import { logger } from "@/services/logger";
import { isOnline } from "@/utils/pwaUtils";
import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => {
      setOnline(true);

      if (wasOffline) {
        logger.info("Connexion rétablie", "PWA");
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setOnline(false);
      setWasOffline(true);
      logger.warn("Connexion perdue - Mode hors ligne", "PWA");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return {
    online,
    wasOffline,
  };
}

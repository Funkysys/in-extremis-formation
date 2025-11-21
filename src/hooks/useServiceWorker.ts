import {
  isAppInstalled,
  registerServiceWorker,
  skipWaiting,
  updateServiceWorker,
} from "@/utils/pwaUtils";
import { useCallback, useEffect, useState } from "react";

export function useServiceWorker() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    registerServiceWorker().then((reg) => {
      setRegistration(reg);
      setIsInstalled(isAppInstalled());
    });

    const handleUpdate = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener("sw-update-available", handleUpdate);

    return () => {
      window.removeEventListener("sw-update-available", handleUpdate);
    };
  }, []);

  const update = useCallback(async () => {
    if (registration) {
      await updateServiceWorker();
      skipWaiting();
      window.location.reload();
    }
  }, [registration]);

  return {
    registration,
    updateAvailable,
    isInstalled,
    update,
  };
}

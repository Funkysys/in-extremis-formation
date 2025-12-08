import { logger } from "@/services/logger";
import {
  PWA_CONFIG,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/utils/pwaUtils";
import { useCallback, useEffect, useState } from "react";
import { useServiceWorker } from "./useServiceWorker";

export function usePushNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { registration } = useServiceWorker();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    if (registration) {
      registration.pushManager.getSubscription().then(setSubscription);
    }
  }, [registration]);

  const requestPermission = useCallback(async () => {
    setLoading(true);

    try {
      const perm = await requestNotificationPermission();
      setPermission(perm);
      return perm;
    } finally {
      setLoading(false);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!registration || !PWA_CONFIG.VAPID_PUBLIC_KEY) {
      logger.error("Service Worker ou clé VAPID manquante", null, "PWA");
      return null;
    }

    setLoading(true);

    try {
      const sub = await subscribeToPush(
        registration,
        PWA_CONFIG.VAPID_PUBLIC_KEY
      );
      setSubscription(sub);
      return sub;
    } finally {
      setLoading(false);
    }
  }, [registration]);

  const unsubscribe = useCallback(async () => {
    if (!registration) {
      return false;
    }

    setLoading(true);

    try {
      const success = await unsubscribeFromPush(registration);

      if (success) {
        setSubscription(null);
      }

      return success;
    } finally {
      setLoading(false);
    }
  }, [registration]);

  return {
    permission,
    subscription,
    loading,
    isSubscribed: !!subscription,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

/**
 * Gestion des notifications push
 * Responsabilité : Notifications et push uniquement
 */

import { logger } from "@/services/logger";

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    logger.warn("Notifications non supportées", "PWA");
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    logger.info("Permission notifications", "PWA", { permission });
    return permission;
  } catch (error) {
    logger.error("Échec demande permission notifications", error, "PWA");
    return "denied";
  }
}

export async function subscribeToPush(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      logger.warn("Permission notifications refusée", "PWA");
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        vapidPublicKey
      ) as BufferSource,
    });

    logger.info("Abonnement push créé", "PWA");
    return subscription;
  } catch (error) {
    logger.error("Échec abonnement push", error, "PWA");
    return null;
  }
}

export async function unsubscribeFromPush(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const success = await subscription.unsubscribe();
      logger.info("Désabonnement push", "PWA", { success });
      return success;
    }
    return false;
  } catch (error) {
    logger.error("Échec désabonnement push", error, "PWA");
    return false;
  }
}

export async function sendTestNotification(
  title: string,
  body: string
): Promise<void> {
  if (!("Notification" in window)) {
    logger.warn("Notifications non supportées", "PWA");
    return;
  }

  const permission = await requestNotificationPermission();
  if (permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
    });
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Utilitaires PWA - Service Worker, Installation, Notifications
 */

import { logger } from "@/services/logger";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface PushSubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: string;
}

/**
 * Enregistre le Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    logger.warn("Service Worker non supporté", "PWA");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    logger.info("Service Worker enregistré", "PWA", {
      scope: registration.scope,
      updatefound: !!registration.waiting,
    });

    // Écouter les mises à jour
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      if (newWorker) {
        logger.info("Nouvelle version du Service Worker détectée", "PWA");

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // Nouveau SW installé mais ancien encore actif
            logger.info("Mise à jour disponible", "PWA");

            // Émettre un événement custom pour l'UI
            window.dispatchEvent(
              new CustomEvent("sw-update-available", {
                detail: { registration },
              })
            );
          }
        });
      }
    });

    return registration;
  } catch (error) {
    logger.error("Échec enregistrement Service Worker", error, "PWA");
    return null;
  }
}

/**
 * Désenregistre le Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      const success = await registration.unregister();
      logger.info("Service Worker désenregistré", "PWA");
      return success;
    }

    return false;
  } catch (error) {
    logger.error("Échec désenregistrement Service Worker", error, "PWA");
    return false;
  }
}

/**
 * Force la mise à jour du Service Worker
 */
export async function updateServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      await registration.update();
      logger.info("Service Worker mis à jour", "PWA");
    }
  } catch (error) {
    logger.error("Échec mise à jour Service Worker", error, "PWA");
  }
}

/**
 * Active immédiatement le nouveau Service Worker
 */
export function skipWaiting(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" });
  logger.info("Skip waiting envoyé au Service Worker", "PWA");
}

/**
 * Vérifie si l'app est installée (PWA)
 */
export function isAppInstalled(): boolean {
  // Mode standalone = app installée
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

/**
 * Vérifie si l'installation PWA est disponible
 */
export function canInstallPWA(): boolean {
  return !isAppInstalled() && "BeforeInstallPromptEvent" in window;
}

/**
 * Demande la permission pour les notifications
 */
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

/**
 * S'abonner aux notifications push
 */
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

/**
 * Se désabonner des notifications push
 */
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

/**
 * Envoyer une notification de test
 */
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

/**
 * Obtenir la taille du cache
 */
export async function getCacheSize(): Promise<number> {
  if (!("serviceWorker" in navigator)) {
    return 0;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.size || 0);
    };

    navigator.serviceWorker.controller?.postMessage(
      { type: "GET_CACHE_SIZE" },
      [messageChannel.port2]
    );
  });
}

/**
 * Vider le cache
 */
export async function clearCache(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.success || false);
    };

    navigator.serviceWorker.controller?.postMessage({ type: "CLEAR_CACHE" }, [
      messageChannel.port2,
    ]);
  });
}

/**
 * Convertir une clé VAPID en Uint8Array
 */
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

/**
 * Vérifier si l'utilisateur est en ligne
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Formater la taille du cache
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Enregistrer une tâche de synchronisation en arrière-plan
 */
export async function registerBackgroundSync(
  registration: ServiceWorkerRegistration,
  tag: string
): Promise<void> {
  if (!("sync" in registration)) {
    logger.warn("Background Sync non supporté", "PWA");
    return;
  }

  try {
    await (
      registration as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> };
      }
    ).sync.register(tag);
    logger.info("Background Sync enregistré", "PWA", { tag });
  } catch (error) {
    logger.error("Échec enregistrement Background Sync", error, "PWA");
  }
}

/**
 * Configuration PWA par défaut
 */
export const PWA_CONFIG = {
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  CACHE_VERSION: "v1.0.0",
  OFFLINE_URL: "/offline",
  NOTIFICATION_ICON: "/icons/icon-192x192.png",
  NOTIFICATION_BADGE: "/icons/icon-96x96.png",
};

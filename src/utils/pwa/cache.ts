/**
 * Gestion du cache PWA
 * Responsabilité : Cache et storage uniquement
 */

import { logger } from "@/services/logger";

export async function getCacheSize(): Promise<number> {
  if (!("serviceWorker" in navigator)) return 0;

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

export async function clearCache(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;

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

export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

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

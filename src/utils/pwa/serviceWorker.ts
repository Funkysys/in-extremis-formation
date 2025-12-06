/**
 * Gestion du Service Worker
 * Responsabilité : Enregistrement et mise à jour SW uniquement
 */

import { logger } from "@/services/logger";

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
    });

    setupUpdateListener(registration);
    return registration;
  } catch (error) {
    logger.error("Échec enregistrement Service Worker", error, "PWA");
    return null;
  }
}

function setupUpdateListener(registration: ServiceWorkerRegistration): void {
  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;

    if (newWorker) {
      logger.info("Nouvelle version du Service Worker détectée", "PWA");

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          logger.info("Mise à jour disponible", "PWA");
          window.dispatchEvent(
            new CustomEvent("sw-update-available", {
              detail: { registration },
            })
          );
        }
      });
    }
  });
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;

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

export async function updateServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

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

export function skipWaiting(): void {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" });
  logger.info("Skip waiting envoyé au Service Worker", "PWA");
}

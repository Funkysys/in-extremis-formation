/**
 * Utilitaires PWA divers
 * Responsabilité : Installation et helpers
 */

export function isAppInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

export function canInstallPWA(): boolean {
  return !isAppInstalled() && "BeforeInstallPromptEvent" in window;
}

export function isOnline(): boolean {
  return navigator.onLine;
}

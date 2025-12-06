/**
 * Utilitaires PWA - Point d'entrée
 * Responsabilité : Exports uniquement
 */

export { PWA_CONFIG } from "./pwa/types";
export type {
  BeforeInstallPromptEvent,
  PushSubscriptionOptions,
} from "./pwa/types";

export {
  registerServiceWorker,
  skipWaiting,
  unregisterServiceWorker,
  updateServiceWorker,
} from "./pwa/serviceWorker";

export {
  requestNotificationPermission,
  sendTestNotification,
  subscribeToPush,
  unsubscribeFromPush,
} from "./pwa/notifications";

export {
  clearCache,
  formatCacheSize,
  getCacheSize,
  registerBackgroundSync,
} from "./pwa/cache";

export { canInstallPWA, isAppInstalled, isOnline } from "./pwa/helpers";

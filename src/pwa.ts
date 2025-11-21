/**
 * Export central pour toutes les fonctionnalités PWA
 */

// Hooks
export { useCache } from "./hooks/useCache";
export { useInstallPrompt } from "./hooks/useInstallPrompt";
export { useOnlineStatus } from "./hooks/useOnlineStatus";
export { usePushNotifications } from "./hooks/usePushNotifications";
export { useServiceWorker } from "./hooks/useServiceWorker";
// export { useIsPWA, usePWA, useSlowConnection } from "./hooks/usePWA"; // TODO: Créer ces hooks

// Composants
export { InstallPrompt } from "./components/pwa/InstallPrompt";
export { OfflineBanner } from "./components/pwa/OfflineBanner";
export { PWAManager } from "./components/pwa/PWAManager";
export { PWAStatus } from "./components/pwa/PWAStatus";
export { UpdateNotification } from "./components/pwa/UpdateNotification";

// Utilitaires
export {
  canInstallPWA,
  clearCache,
  formatCacheSize,
  getCacheSize,
  isAppInstalled,
  isOnline,
  PWA_CONFIG,
  registerBackgroundSync,
  registerServiceWorker,
  requestNotificationPermission,
  sendTestNotification,
  skipWaiting,
  subscribeToPush,
  unregisterServiceWorker,
  unsubscribeFromPush,
  updateServiceWorker,
  type BeforeInstallPromptEvent,
  type PushSubscriptionOptions,
} from "./utils/pwaUtils";

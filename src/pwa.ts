/**
 * Export central pour toutes les fonctionnalités PWA
 */

// Hooks
export { useInstallPrompt } from "./hooks/pwa/useInstallPrompt";
export { usePushNotifications } from "./hooks/pwa/usePushNotifications";
export { useServiceWorker } from "./hooks/pwa/useServiceWorker";
export { useCache } from "./hooks/utils/useCache";
export { useOnlineStatus } from "./hooks/utils/useOnlineStatus";
// export { useIsPWA, usePWA, useSlowConnection } from "./hooks/usePWA"; // TODO: Créer ces hooks

// Composants
export { InstallPrompt } from "./components/pwa/InstallPrompt";
export { OfflineBanner } from "./components/pwa/OfflineBanner";
export { PWAManager } from "./components/pwa/PWAManager";
export { PWAStatus } from "./components/pwa/PWAStatus";
export { UpdateNotification } from "./components/pwa/UpdateNotification";

// Utilitaires
export {
  PWA_CONFIG,
  canInstallPWA,
  clearCache,
  formatCacheSize,
  getCacheSize,
  isAppInstalled,
  isOnline,
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

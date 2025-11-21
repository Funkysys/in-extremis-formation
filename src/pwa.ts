/**
 * Export central pour toutes les fonctionnalités PWA
 */

// Hooks
export {
  useCache,
  useInstallPrompt,
  useIsPWA,
  useOnlineStatus,
  usePWA,
  usePushNotifications,
  useServiceWorker,
  useSlowConnection,
} from "./hooks/usePWA";

// Composants
export {
  InstallPrompt,
  OfflineBanner,
  PWAManager,
  PWAStatus,
  UpdateNotification,
} from "./components/pwa/PWAComponents";

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

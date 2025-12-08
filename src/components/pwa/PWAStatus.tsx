"use client";

import {
  useOnlineStatus,
  usePushNotifications,
  useServiceWorker,
} from "@/hooks/pwa";

export function PWAStatus() {
  const { registration, isInstalled, updateAvailable } = useServiceWorker();
  const { online } = useOnlineStatus();
  const { permission, isSubscribed } = usePushNotifications();

  return (
    <div className="p-4 space-y-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold text-gray-900 dark:text-white">État PWA</h3>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-gray-600 dark:text-gray-400">
            Service Worker:
          </span>
          <span
            className={`ml-2 ${
              registration ? "text-green-600" : "text-red-600"
            }`}
          >
            {registration ? "✓ Actif" : "✗ Inactif"}
          </span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">
            Installation:
          </span>
          <span
            className={`ml-2 ${
              isInstalled ? "text-green-600" : "text-gray-600"
            }`}
          >
            {isInstalled ? "✓ Installée" : "○ Web"}
          </span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">Connexion:</span>
          <span
            className={`ml-2 ${online ? "text-green-600" : "text-yellow-600"}`}
          >
            {online ? "✓ En ligne" : "○ Hors ligne"}
          </span>
        </div>

        <div>
          <span className="text-gray-600 dark:text-gray-400">
            Notifications:
          </span>
          <span
            className={`ml-2 ${
              isSubscribed ? "text-green-600" : "text-gray-600"
            }`}
          >
            {permission === "granted" && isSubscribed
              ? "✓ Actives"
              : "○ Désactivées"}
          </span>
        </div>

        {updateAvailable && (
          <div className="col-span-2">
            <span className="text-blue-600 dark:text-blue-400">
              ⟳ Mise à jour disponible
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

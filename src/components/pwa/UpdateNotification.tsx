"use client";

import { useServiceWorker } from "@/hooks/pwa";
import { useEffect, useState } from "react";

export function UpdateNotification() {
  const { updateAvailable, update } = useServiceWorker();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShow(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    update();
  };

  const handleDismiss = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-blue-600 text-white rounded-lg shadow-xl p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">Mise à jour disponible</h3>
          <p className="mt-1 text-sm text-blue-100">
            Une nouvelle version de l&apos;application est disponible
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-md transition-colors"
            >
              Mettre à jour
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

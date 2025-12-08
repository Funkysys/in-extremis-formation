"use client";

import { useOnlineStatus } from "@/hooks/pwa";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const { online, wasOffline } = useOnlineStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!online) {
      setShow(true);
    } else if (wasOffline) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [online, wasOffline]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-medium transition-colors ${
        online ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
      }`}
    >
      {online ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Connexion rétablie
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clipRule="evenodd"
            />
          </svg>
          Mode hors ligne - Contenu limité disponible
        </span>
      )}
    </div>
  );
}

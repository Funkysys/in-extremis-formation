"use client";

/**
 * Page hors ligne - Affichée quand l'utilisateur est offline
 */

import { useOnlineStatus } from "@/hooks/pwa";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OfflinePage() {
  const { online } = useOnlineStatus();
  const router = useRouter();

  useEffect(() => {
    if (online) {
      // Rediriger vers la page d'accueil si la connexion revient
      router.push("/");
    }
  }, [online, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Vous êtes hors ligne
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Vérifiez votre connexion Internet pour accéder à l&apos;ensemble du
          contenu.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Contenu disponible hors ligne
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Pages récemment visitées</li>
            <li>• Images en cache</li>
            <li>• Certaines données de cours</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Réessayer
        </button>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          <p>Cette page est mise en cache et disponible hors ligne</p>
        </div>
      </div>
    </div>
  );
}

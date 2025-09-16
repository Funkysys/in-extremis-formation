"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur dans la page de formation:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-slate-300 mb-6">
          {error.message ||
            "Une erreur est survenue lors du chargement des formations."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors text-center"
          >
            {`Retour à l'accueil`}
          </Link>
        </div>
        {error.digest && (
          <div className="mt-6 p-3 bg-slate-700 rounded text-xs text-slate-400 overflow-x-auto">
            <p className="font-mono">Erreur ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  );
}

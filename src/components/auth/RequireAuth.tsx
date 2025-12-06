"use client";

import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Connectez-vous pour accéder à cette page
            </p>
            <Link
              href="/auth/callback"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

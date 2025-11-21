// Composant: QuickNavigation - Navigation rapide du dashboard

import { ADMIN_ROUTES } from "@/lib/admin/constants";
import Link from "next/link";

export const QuickNavigation = () => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex flex-wrap gap-4">
        <Link
          href={ADMIN_ROUTES.users}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          📋 Gestion Utilisateurs
        </Link>
        <Link
          href={ADMIN_ROUTES.videos}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          🎥 Modération Vidéos
        </Link>
        <Link
          href={ADMIN_ROUTES.payments}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          💰 Gestion Paiements
        </Link>
      </div>
    </div>
  );
};

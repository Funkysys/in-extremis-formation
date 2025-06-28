import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AdminContent() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-100 border-b-2 border-slate-300 pb-2">Administration</h1>
      <nav className="flex flex-col gap-4 mb-8">
        <Link
          href="/admin/roles"
          className="btn bg-amber-700 hover:bg-amber-800 text-slate-100 font-semibold w-full max-w-xs shadow-md"
        >
          {`Gérer les rôles`}
        </Link>
      </nav>
      <div className="bg-white rounded-lg shadow p-6 text-slate-800">
        <p>
          {`Bienvenue sur la page d'administration. Utilisez la navigation ci-dessus pour accéder aux différentes fonctionnalités réservées aux administrateurs.`}
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}

"use client";
import Link from "next/link";
import RoleList from "./RoleList";

export default function AdminRolesPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8 text-slate-100 border-b-2 border-slate-300 hover:text-slate-900">Gestion des rôles</h1>
      <nav className="flex gap-4 mb-6">
        <Link href="/formation/admin" className="btn btn-outline border-slate-300 text-slate-100">
          ← Retour à l'administration
        </Link>
      </nav>
      <div className="bg-white rounded-lg shadow p-6 text-slate-800">
        <p className="mb-4">
          Ici tu pourras gérer les rôles des utilisateurs (ajouter, retirer, modifier).
        </p>
        <RoleList />
      </div>
    </div>
  );
}

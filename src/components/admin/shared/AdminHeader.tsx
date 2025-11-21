// Composant: AdminHeader - En-tête pour les pages admin

import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  description: string;
  backLink?: string;
}

export const AdminHeader = ({
  title,
  description,
  backLink = "/admin/dashboard",
}: AdminHeaderProps) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <Link
        href={backLink}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ← Retour au Dashboard
      </Link>
    </div>
  );
};

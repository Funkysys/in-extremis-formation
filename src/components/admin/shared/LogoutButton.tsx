// Composant: LogoutButton - Bouton de déconnexion

import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  isOpen: boolean;
}

export const LogoutButton = ({ isOpen }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <button
      className="flex items-center gap-3 px-4 py-2 mb-4 rounded-lg transition-colors group hover:bg-error hover:text-white bg-slate-700 text-white font-semibold shadow-md border-none"
      onClick={handleLogout}
      aria-label="Se déconnecter"
    >
      <svg
        className="text-xl"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="24"
        height="24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2h-3a2 2 0 01-2-2V7a2 2 0 012-2h3a2 2 0 012 2v1"
        />
      </svg>
      {isOpen && <span className="font-medium">Se déconnecter</span>}
    </button>
  );
};

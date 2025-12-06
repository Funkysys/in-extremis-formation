"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Login from "../auth/Login";
import LanguageSwitcher from "../global/LanguageSwitcher";
import HorizontalMenu from "./HorizontalMenu";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const { showToast } = useToast();
  const { user, isLoading, token, isAuthenticated } = useAuth();

  console.log("🎯 Header - Auth state:", {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated,
    isLoading,
    userId: user?.id,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const roles = user?.role ? [user.role] : [];
  const rolePriority = ["superadmin", "admin", "formateur", "staff", "user"];
  const role = roles.find((r: string) => rolePriority.includes(r)) || null;

  return (
    <div
      className="flex items-center justify-between w-full p-6 border-b border-slate-200"
      style={{ marginTop: "60px" }}
    >
      <h1 className="text-4xl font-roboto text-slate-100">
        {title ?? "Découvrez toutes nos formations"}
      </h1>
      <div className="flex items-center space-x-6">
        <LanguageSwitcher currentLocale="fr" />
        {user ? (
          <HorizontalMenu role={role} />
        ) : (
          <Login
            onSuccess={async () => {
              showToast("Connexion réussie !", "success");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Header;

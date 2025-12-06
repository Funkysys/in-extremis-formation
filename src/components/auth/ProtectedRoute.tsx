"use client";

import { useToast } from "@/providers/ToastProvider";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "formateur" | "admin" | "superadmin";
}

const roleHierarchy = {
  user: 0,
  formateur: 1,
  admin: 2,
  superadmin: 3,
};

export default function ProtectedRoute({
  children,
  requiredRole = "user",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    // Vérifier l'authentification uniquement côté client
    const checkAuth = () => {
      try {
        // Récupérer les infos du localStorage
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        // Si pas de token, rediriger vers la page de connexion
        if (!token) {
          console.log("Aucun token trouvé, redirection vers /auth/login");
          showToast(
            "Veuillez vous connecter pour accéder à cette page",
            "error"
          );
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          return false;
        }

        // Vérifier le format du token
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          console.error("Format de token invalide");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          showToast("Session invalide, veuillez vous reconnecter", "error");
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          return false;
        }

        // Vérifier l'expiration du token
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            console.log("Token expiré");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            showToast(
              "Votre session a expiré, veuillez vous reconnecter",
              "error"
            );
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
            return false;
          }
        } catch (e) {
          console.error("Erreur lors de la vérification du token:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          showToast("Erreur de session, veuillez vous reconnecter", "error");
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          return false;
        }

        // Vérifier les rôles si nécessaire
        if (requiredRole !== "user") {
          if (!userData) {
            console.error("Données utilisateur manquantes");
            return false;
          }

          const user = JSON.parse(userData);
          const userRoles = user.role ? [user.role] : [];

          // Vérifier si l'utilisateur a le rôle requis ou un rôle supérieur
          const hasRequiredRole = userRoles.some((role: string) => {
            return (
              roleHierarchy[role as keyof typeof roleHierarchy] >=
              roleHierarchy[requiredRole as keyof typeof roleHierarchy]
            );
          });

          if (!hasRequiredRole) {
            console.log("Accès refusé: rôle insuffisant");
            showToast(
              "Vous n'avez pas les droits pour accéder à cette page",
              "error"
            );
            router.push("/");
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast(
          "Une erreur est survenue, veuillez vous reconnecter",
          "error"
        );
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return false;
      }
    };

    checkAuth();
  }, [router, pathname, requiredRole, showToast]);

  // Si on arrive ici, c'est que l'utilisateur est authentifié et a les droits
  return <>{children}</>;
}

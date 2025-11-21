"use client";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useToast } from "@/providers/ToastProvider";
import { useApolloClient, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Login from "../auth/Login";
import LanguageSwitcher from "../global/LanguageSwitcher";
import HorizontalMenu from "./HorizontalMenu";

interface HeaderProps {
  title?: string;
}
type Role = { name: string };

const Header = ({ title }: HeaderProps) => {
  const client = useApolloClient();
  const { showToast } = useToast();
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    skip: !hasToken,
    onCompleted: (data) => {
      if (data?.me) {
        // Stocker les infos utilisateur dans le localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.me.email,
            roles: data.me.roles?.map((r: Role) => r.name) || [],
          })
        );
        console.log("Utilisateur connecté:", data.me.email);
      }
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      // En cas d'erreur, on nettoie le localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setHasToken(false);
    },
  });

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token) {
        console.log("Aucun token trouvé");
        setHasToken(false);
        return;
      }

      try {
        // Vérifier l'expiration du token
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3)
          throw new Error("Format de token invalide");

        const payload = JSON.parse(atob(tokenParts[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("Token expiré");
          // Ici, vous pourriez ajouter une logique de refresh token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setHasToken(false);
        } else {
          console.log("Token valide");
          setHasToken(true);
          // Rafraîchir les données utilisateur si nécessaire
          if (!userData) {
            refetch();
          }
        }
      } catch (error) {
        console.error("Erreur de vérification du token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setHasToken(false);
      }
    };

    checkAuth();

    // Vérifier périodiquement (toutes les minutes)
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    console.log("hasToken:", hasToken);
    console.log("Chargement:", loading);
    console.log("Données utilisateur:", data);
    console.log("Erreur:", error);

    if (!hasToken) {
      console.log("Pas de token, marquage comme vérifié");
      setTokenChecked(true);
      return;
    }

    if (!loading) {
      if (!data?.me) {
        console.log("Aucune donnée utilisateur, suppression du token");
        localStorage.removeItem("token");
      } else {
        console.log("Utilisateur connecté:", data.me.email);
      }
      setTokenChecked(true);
    }
  }, [hasToken, data, loading, error]);

  if (!tokenChecked || (hasToken && loading && !data?.me)) {
    return <div>Chargement...</div>;
  }

  const roles = data?.me?.roles?.map((r: Role) => r.name) || [];
  console.log("Rôles extraits:", roles);

  const rolePriority = ["superadmin", "admin", "formateur", "staff", "user"];
  const role = roles.find((r: string) => rolePriority.includes(r)) || null;
  console.log("Rôle sélectionné:", role);
  return (
    <div className="w-full p-6 border-b border-slate-200 flex justify-between items-center">
      <h1 className="text-4xl font-roboto text-slate-100">
        {title ?? "Découvrez toutes nos formations"}
      </h1>
      <div className="flex items-center gap-4">
        <LanguageSwitcher currentLocale="fr" />
        {data?.me ? (
          <HorizontalMenu role={role} />
        ) : (
          <Login
            onSuccess={async () => {
              showToast("Connexion réussie !", "success");
              setHasToken(true);
              await client.refetchQueries({ include: [ME_QUERY] });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Header;

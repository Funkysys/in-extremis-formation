import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

interface UseUserDataProps {
  hasToken: boolean;
  onTokenInvalid: () => void;
}

export function useUserData({ hasToken, onTokenInvalid }: UseUserDataProps) {
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    skip: !hasToken,
    onCompleted: (data) => {
      if (data?.me) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.me.email,
            role: data.me.role,
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      onTokenInvalid();
    },
  });

  useEffect(() => {
    if (!hasToken) return;
    if (!loading && !data?.me) {
      console.log("Aucune donnée utilisateur, suppression du token");
      localStorage.removeItem("token");
    } else if (data?.me) {
      console.log("Utilisateur connecté:", data.me.email);
    }
  }, [hasToken, data, loading]);

  return { data, loading, error, refetch };
}

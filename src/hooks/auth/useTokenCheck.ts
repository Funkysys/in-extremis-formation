"use client";
import { useEffect, useState } from "react";

interface TokenCheckResult {
  hasToken: boolean;
  tokenChecked: boolean;
}

export function useTokenCheck(): TokenCheckResult {
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Aucun token trouvé");
        setHasToken(false);
        setTokenChecked(true);
        return;
      }

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3)
          throw new Error("Format de token invalide");
        console.log("Format de token invalide");

        const payload = JSON.parse(atob(tokenParts[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("Token expiré");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setHasToken(false);
        } else {
          console.log("Token valide");
          setHasToken(true);
        }
        setTokenChecked(true);
      } catch (error) {
        console.error("Erreur de vérification du token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setHasToken(false);
        setTokenChecked(true);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  return { hasToken, tokenChecked };
}

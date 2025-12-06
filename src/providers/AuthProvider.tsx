"use client";

import { ME_QUERY } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  is_premium?: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user?: User) => Promise<void>;
  signOut: () => void;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction pour vérifier si le token JWT est expiré
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convertir en millisecondes
    return Date.now() >= exp;
  } catch {
    console.log("JWT expired");

    return true; // Si on ne peut pas parser, considérer comme expiré
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("🔄 AuthProvider RENDER");

  // Initialiser avec les valeurs du localStorage pour éviter le flash de déconnexion
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      console.log(
        "📦 Init user from localStorage:",
        stored ? "trouvé" : "absent"
      );
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const tok = localStorage.getItem("token");
      console.log(
        "📦 Init token from localStorage:",
        tok ? tok.substring(0, 20) + "..." : "absent"
      );
      return tok;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      const hasToken = !!localStorage.getItem("token");
      const hasUser = !!localStorage.getItem("user");
      const auth = hasToken && hasUser;
      console.log("🔐 Init isAuthenticated:", auth, { hasToken, hasUser });
      return auth;
    }
    return false;
  });

  const [fetchMe] = useLazyQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.me) {
        const userData = {
          id: data.me.id,
          email: data.me.email,
          username: data.me.username,
          isActive: data.me.isActive,
          role: data.me.role,
          createdAt: data.me.createdAt,
          updatedAt: data.me.updatedAt,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la récupération du profil:", error);
      signOut();
    },
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          // Vérifier si le token est expiré
          if (isTokenExpired(storedToken)) {
            console.log("🔑 Token expiré, déconnexion");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }

          console.log("🔑 Token valide trouvé dans localStorage");
          setToken(storedToken);
          setIsAuthenticated(true);

          // Charger l'utilisateur depuis localStorage immédiatement
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser && typeof parsedUser === "object") {
                setUser(parsedUser);
              }
            } catch (e) {
              console.error("Erreur parsing user:", e);
            }
          }

          // Tenter de récupérer le profil utilisateur via GraphQL en arrière-plan
          try {
            await fetchMe();
          } catch {
            console.warn(
              "Impossible de refetch le profil, utilisation des données locales"
            );
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error
        );
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (newToken: string, userData?: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      // Récupérer le profil via GraphQL
      await fetchMe();
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refetchUser = async () => {
    if (token) {
      await fetchMe();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        signIn,
        signOut,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

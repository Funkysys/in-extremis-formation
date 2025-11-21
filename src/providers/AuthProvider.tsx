"use client";

import { ME_QUERY } from "@/graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  fullName: string;
  zipCode?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isOauth: boolean;
  isActive: boolean;
  isSuperuser: boolean;
  is_premium?: boolean;
  roles?: { name: string }[];
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [fetchMe] = useLazyQuery(ME_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.me) {
        const userData = {
          id: data.me.id,
          email: data.me.email,
          fullName: data.me.fullName,
          zipCode: data.me.zipCode,
          phone: data.me.phone,
          address: data.me.address,
          city: data.me.city,
          country: data.me.country,
          isOauth: data.me.isOauth,
          isActive: data.me.isActive,
          isSuperuser: data.me.isSuperuser,
          roles: data.me.roles,
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
          setToken(storedToken);

          // Tenter de récupérer le profil utilisateur via GraphQL
          try {
            await fetchMe();
          } catch {
            // Si l'erreur est liée au token, on utilise les données locales
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser && typeof parsedUser === "object") {
                setUser(parsedUser);
              }
            }
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error
        );
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchMe]);

  const signIn = async (newToken: string, userData?: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

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
        isAuthenticated: !!user && !!token,
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

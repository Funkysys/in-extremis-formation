// Hook pour gérer l'authentification admin

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAdminAuth = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.isSuperuser)) {
      router.push("/formation");
    }
  }, [user, isLoading, router]);

  return {
    user,
    isLoading,
    isAdmin: user?.isSuperuser || false,
  };
};

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";

/**
 * LoginWithOAuth component.
 *
 * This component handles OAuth login with Google and Discord.
 */
export default function LoginWithOAuth({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const fetchUserInfo = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(
            "Échec de la récupération des informations utilisateur"
          );
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        onSuccess();
        router.push(redirectUrl);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des infos utilisateur:",
          err
        );
        setError("Une erreur est survenue lors de la connexion");
      }
    },
    [onSuccess, router, redirectUrl]
  );

  // Vérifier si on revient d'une authentification OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Récupérer les infos utilisateur
      fetchUserInfo(token);
    }
  }, [fetchUserInfo]);

  /**
   * Handle OAuth login.
   *
   * Redirects to the backend OAuth endpoint (FastAPI) for the given provider.
   */
  const handleOAuth = (provider: "google" | "discord") => {
    setError("");
    // Redirige vers l'endpoint backend OAuth (FastAPI)
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const redirectUri = `${window.location.origin}/auth/callback?redirect=/formation`;
    window.location.href = `${backendUrl}/auth/${provider}/login?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
      <button
        className="btn btn-outline btn-primary flex items-center gap-2"
        onClick={() => handleOAuth("google")}
        type="button"
      >
        <FcGoogle size={22} />
        Se connecter avec Google
      </button>
      <button
        className="btn btn-outline btn-secondary flex items-center gap-2"
        onClick={() => handleOAuth("discord")}
        type="button"
      >
        <SiDiscord size={22} />
        Se connecter avec Discord
      </button>
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </div>
  );
}

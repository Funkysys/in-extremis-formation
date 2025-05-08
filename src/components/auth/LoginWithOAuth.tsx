"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";

/**
 * LoginWithOAuth component.
 * 
 * This component handles OAuth login with Google and Discord.
 * 
 * @param {object} props - Component props.
 * @param {function} props.onSuccess - Callback function to call on successful login.
 */
export default function LoginWithOAuth({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");

  /**
   * Handle OAuth login.
   * 
   * Redirects to the backend OAuth endpoint (FastAPI) for the given provider.
   * 
   * @param {string} provider - OAuth provider (google or discord).
   */
  const handleOAuth = (provider: "google" | "discord") => {
    setError("");
    // Redirige vers l'endpoint backend OAuth (FastAPI)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.location.href = `${backendUrl}/auth/${provider}/login`;
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

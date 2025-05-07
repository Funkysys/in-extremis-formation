"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";
// import { signUpWithProvider } from "better-auth";

export default function RegisterWithOAuth({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");

  // À brancher sur better-auth
  const handleOAuth = async (provider: "google" | "discord") => {
    setError("");
    try {
      // await signUpWithProvider(provider);
      // onSuccess();
      alert(`Redirection vers inscription ${provider}... (à brancher sur better-auth)`);
    } catch (e: any) {
      setError(e.message || "Erreur OAuth");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
      <button
        className="btn btn-outline btn-primary flex items-center gap-2"
        onClick={() => handleOAuth("google")}
        type="button"
      >
        <FcGoogle size={22} />
        S'inscrire avec Google
      </button>
      <button
        className="btn btn-outline btn-secondary flex items-center gap-2"
        onClick={() => handleOAuth("discord")}
        type="button"
      >
        <SiDiscord size={22} />
        S'inscrire avec Discord
      </button>
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </div>
  );
}

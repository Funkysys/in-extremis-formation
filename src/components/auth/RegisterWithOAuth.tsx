"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiDiscord } from "react-icons/si";
import { useSearchParams, useRouter } from 'next/navigation';

interface RegisterWithOAuthProps {
  onSuccess: () => void;
}

export default function RegisterWithOAuth({ onSuccess }: RegisterWithOAuthProps) {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const handleOAuth = (provider: "google" | "discord") => {
    setError("");
    // Redirige vers l'endpoint backend OAuth (FastAPI)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const redirectUri = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = `${backendUrl}/auth/${provider}/register?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto">
      <button
        className="btn btn-outline btn-primary flex items-center gap-2"
        onClick={() => handleOAuth("google")}
        type="button"
      >
        <FcGoogle size={22} />
        {`S'inscrire avec Google`}
      </button>
      <button
        className="btn btn-outline btn-secondary flex items-center gap-2"
        onClick={() => handleOAuth("discord")}
        type="button"
      >
        <SiDiscord size={22} />
        {`S'inscrire avec Discord`}
      </button>
      {error && <div className="text-error text-sm mt-1">{error}</div>}
    </div>
  );
}

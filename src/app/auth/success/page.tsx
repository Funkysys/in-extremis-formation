"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Fetch le profil utilisateur
      fetchProfile(token);
    } else {
      setError("Token manquant. Connexion impossible.");
      setLoading(false);
      setTimeout(() => router.replace("/login?error=oauth"), 2000);
    }
    // eslint-disable-next-line
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de récupérer le profil utilisateur.");
      const data = await res.json();
      setProfile(data);
      setLoading(false);
      setTimeout(() => router.replace("/"), 1500);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la récupération du profil.");
      setLoading(false);
      setTimeout(() => router.replace("/login?error=profile"), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading && (
        <>
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-slate-700">Connexion en cours...</p>
        </>
      )}
      {error && (
        <div className="text-error text-center">
          <p>{error}</p>
        </div>
      )}
      {profile && !loading && (
        <div className="text-success text-center">
          <p>Bienvenue, {profile.fullName || profile.email || "utilisateur"} !</p>
        </div>
      )}
    </div>
  );
}

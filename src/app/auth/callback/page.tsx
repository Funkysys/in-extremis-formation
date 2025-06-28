'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Récupérer les infos utilisateur
      fetchUserInfo(token);
    } else {
      // Rediriger vers la page de connexion en cas d'erreur
      router.push(`/login?error=oauth&redirect=${encodeURIComponent(redirect)}`);
    }
  }, [token, redirect, router]);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user info');
      
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Rediriger vers la page demandée
      window.location.href = redirect;
    } catch (error) {
      console.error('Error fetching user info:', error);
      router.push(`/login?error=auth&redirect=${encodeURIComponent(redirect)}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg">Connexion en cours...</p>
      </div>
    </div>
  );
}

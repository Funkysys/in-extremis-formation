"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseForm } from "@/features/courses/create/CourseForm";

export default function CreerFormationPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!authLoading && !user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      localStorage.setItem('redirectAfterLogin', '/formateur/creer-formation');
      router.push('/connexion');
      return;
    }
  }, [user, authLoading, router]);

  if (authLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="text-lg mb-6">Vous devez être connecté pour accéder à cette page.</p>
        <button 
          onClick={() => {
            // Stocker l'URL actuelle avant la redirection
            localStorage.setItem('redirectAfterLogin', '/formateur/creer-formation');
            router.push('/formation');
          }}
          className="btn btn-primary"
        >
          Se connecter
        </button>
      </div>
    );
  }

  // Afficher le formulaire de création de cours
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Créer une nouvelle formation</h1>
      <CourseForm />
    </div>
  );
}
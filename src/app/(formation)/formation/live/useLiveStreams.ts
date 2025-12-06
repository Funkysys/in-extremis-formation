"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACTIVE_LIVES } from "@/graphql/queries/live-queries";

interface LiveStream {
  streamId: string;
  title?: string;
  description?: string;
  streamerUsername?: string;
  streamerId?: number;
  isActive: boolean;
  viewerCount: number;
  startedAt?: string;
}

export function useLiveStreams() {
  const { user, isLoading } = useAuth();
  
  // Query GraphQL pour récupérer les lives actifs (refresh toutes les 5 secondes)
  const { data, loading: livesLoading, error } = useQuery(GET_ACTIVE_LIVES, {
    pollInterval: 5000, // Rafraîchir toutes les 5 secondes
    fetchPolicy: "network-only", // Toujours fetch depuis le réseau
  });

  const lives: LiveStream[] = data?.activeLiveStreams || [];
  const livesError = error ? error.message : null;

  const isFormateur =
    user?.role === "formateur" ||
    user?.role === "admin" ||
    user?.role === "superadmin";

  const activeLives = lives.filter((l) => l.isActive);
  const pastLives = lives.filter((l) => !l.isActive);

  return {
    lives,
    activeLives,
    pastLives,
    isLoading: isLoading || livesLoading,
    error: livesError,
    isFormateur,
  };
}

export function useCreateLive() {
  const router = useRouter();

  const handleCreateLive = () => {
    const timestamp = Date.now();
    const newLiveId = `live-${timestamp}`;
    console.log("🎬 Création d'un nouveau live:", newLiveId);
    router.push(`/formation/live/${newLiveId}`);
  };

  return { handleCreateLive };
}

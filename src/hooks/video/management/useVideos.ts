// Hook personnalisé pour la gestion des vidéos selon FRONTEND_API_REFERENCE

import {
  ALL_VIDEOS_QUERY,
  MY_VIDEOS_QUERY,
  PREMIUM_VIDEOS_QUERY,
  PUBLIC_VIDEOS_QUERY,
  VIDEO_BY_ID_QUERY,
} from "@/graphql/queries";
import { useQuery } from "@apollo/client";

export interface Video {
  id: string;
  title: string;
  url: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  tags?: string[];
  is_published: boolean;
  is_premium?: boolean;
  user_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoInput {
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  is_published?: boolean;
}

export interface VideoUpdateInput {
  title?: string;
  description?: string;
  tags?: string[];
  is_published?: boolean;
}

/**
 * Hook pour récupérer une vidéo par ID
 */
export function useVideo(id: number | null) {
  return useQuery(VIDEO_BY_ID_QUERY, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Hook pour récupérer les vidéos publiques (avec pagination)
 */
export function usePublicVideos(limit = 10, offset = 0) {
  return useQuery(PUBLIC_VIDEOS_QUERY, {
    variables: { limit, offset },
  });
}

/**
 * Hook pour récupérer les vidéos premium (avec pagination)
 */
export function usePremiumVideos(limit = 10, offset = 0) {
  return useQuery(PREMIUM_VIDEOS_QUERY, {
    variables: { limit, offset },
  });
}

/**
 * Hook pour récupérer les vidéos de l'utilisateur connecté (avec pagination)
 */
export function useMyVideos(limit = 10, offset = 0) {
  return useQuery(MY_VIDEOS_QUERY, {
    variables: { limit, offset },
  });
}

/**
 * Hook pour récupérer toutes les vidéos (admin uniquement, avec pagination)
 */
export function useAllVideos(limit = 10, offset = 0) {
  return useQuery(ALL_VIDEOS_QUERY, {
    variables: { limit, offset },
  });
}

// Mutations et pagination extraites vers useVideoMutations.ts et useVideosPagination.ts

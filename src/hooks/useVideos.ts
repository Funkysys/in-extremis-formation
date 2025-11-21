// Hook personnalisé pour la gestion des vidéos selon FRONTEND_API_REFERENCE

import {
  CREATE_VIDEO_MUTATION,
  DELETE_VIDEO_MUTATION,
  MODERATE_VIDEO_MUTATION,
  SET_VIDEO_PREMIUM_MUTATION,
  UPDATE_VIDEO_MUTATION,
} from "@/graphql/mutations";
import {
  ALL_VIDEOS_QUERY,
  MY_VIDEOS_QUERY,
  PREMIUM_VIDEOS_QUERY,
  PUBLIC_VIDEOS_QUERY,
  VIDEO_BY_ID_QUERY,
} from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

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

/**
 * Hook pour gérer les mutations vidéo
 */
export function useVideoMutations() {
  const [createVideo, { loading: creating }] = useMutation(
    CREATE_VIDEO_MUTATION
  );
  const [updateVideo, { loading: updating }] = useMutation(
    UPDATE_VIDEO_MUTATION
  );
  const [deleteVideo, { loading: deleting }] = useMutation(
    DELETE_VIDEO_MUTATION
  );
  const [moderateVideo, { loading: moderating }] = useMutation(
    MODERATE_VIDEO_MUTATION
  );
  const [setVideoPremium, { loading: settingPremium }] = useMutation(
    SET_VIDEO_PREMIUM_MUTATION
  );

  return {
    createVideo,
    updateVideo,
    deleteVideo,
    moderateVideo,
    setVideoPremium,
    loading: creating || updating || deleting || moderating || settingPremium,
  };
}

/**
 * Hook complet pour la gestion paginée des vidéos
 */
export function useVideosPagination(
  type: "public" | "premium" | "my" | "all" = "public"
) {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const queryMap = {
    public: usePublicVideos,
    premium: usePremiumVideos,
    my: useMyVideos,
    all: useAllVideos,
  };

  const { data, loading, error, refetch, fetchMore } = queryMap[type](
    limit,
    offset
  );

  const loadMore = () => {
    setOffset((prev) => prev + limit);
    fetchMore({
      variables: {
        limit,
        offset: offset + limit,
      },
    });
  };

  const reset = () => {
    setOffset(0);
    refetch({ limit, offset: 0 });
  };

  return {
    videos: data?.[`${type}Videos`] || [],
    loading,
    error,
    loadMore,
    reset,
    hasMore: data?.[`${type}Videos`]?.length === limit,
  };
}

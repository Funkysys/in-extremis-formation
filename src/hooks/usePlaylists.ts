/**
 * Hook principal pour gérer les playlists
 * Responsabilité : Orchestration uniquement
 */

"use client";

import {
  GET_PLAYLIST_DETAIL_QUERY,
  GET_USER_PLAYLISTS_QUERY,
} from "@/graphql/queries/playlists";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { usePlaylistCourses } from "./usePlaylistCourses";
import { usePlaylistMutations } from "./usePlaylistMutations";

export const usePlaylists = (userId?: string) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: playlistsData,
    loading: loadingPlaylists,
    refetch: refetchPlaylists,
  } = useQuery(GET_USER_PLAYLISTS_QUERY, {
    variables: { userId, page: 1, limit: 20 },
    skip: !userId,
  });

  const mutations = usePlaylistMutations(userId);
  const courses = usePlaylistCourses();

  const createPlaylist = async (
    input: Parameters<typeof mutations.createPlaylist>[0]
  ) => {
    setIsCreating(true);
    try {
      return await mutations.createPlaylist(input);
    } finally {
      setIsCreating(false);
    }
  };

  const updatePlaylist = async (
    id: string,
    input: Parameters<typeof mutations.updatePlaylist>[1]
  ) => {
    setIsUpdating(true);
    try {
      return await mutations.updatePlaylist(id, input);
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePlaylist = async (id: string) => {
    setIsDeleting(true);
    try {
      return await mutations.deletePlaylist(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    playlists: playlistsData?.userPlaylists?.playlists || [],
    totalCount: playlistsData?.userPlaylists?.totalCount || 0,
    hasMore: playlistsData?.userPlaylists?.hasMore || false,
    loadingPlaylists,
    isCreating,
    isUpdating,
    isDeleting,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addCourseToPlaylist: courses.addCourseToPlaylist,
    removeCourseFromPlaylist: courses.removeCourseFromPlaylist,
    reorderPlaylistCourses: courses.reorderPlaylistCourses,
    refetchPlaylists,
  };
};

export const usePlaylistDetail = (playlistId?: string) => {
  const { data, loading, refetch } = useQuery(GET_PLAYLIST_DETAIL_QUERY, {
    variables: { id: playlistId },
    skip: !playlistId,
  });

  return {
    playlist: data?.playlist,
    loading,
    refetch,
  };
};

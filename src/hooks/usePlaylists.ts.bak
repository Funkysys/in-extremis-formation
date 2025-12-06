"use client";

import {
  ADD_COURSE_TO_PLAYLIST_MUTATION,
  CREATE_PLAYLIST_MUTATION,
  DELETE_PLAYLIST_MUTATION,
  REMOVE_COURSE_FROM_PLAYLIST_MUTATION,
  REORDER_PLAYLIST_COURSES_MUTATION,
  UPDATE_PLAYLIST_MUTATION,
} from "@/graphql/mutations/playlists";
import {
  GET_PLAYLIST_DETAIL_QUERY,
  GET_USER_PLAYLISTS_QUERY,
} from "@/graphql/queries/playlists";
import { logger } from "@/services/logger";
import { ToastService } from "@/services/toastService";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

interface CreatePlaylistInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

interface UpdatePlaylistInput {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export const usePlaylists = (userId?: string) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Récupérer les playlists de l'utilisateur
  const {
    data: playlistsData,
    loading: loadingPlaylists,
    refetch: refetchPlaylists,
  } = useQuery(GET_USER_PLAYLISTS_QUERY, {
    variables: { userId, page: 1, limit: 20 },
    skip: !userId,
  });

  // Mutations
  const [createPlaylistMutation] = useMutation(CREATE_PLAYLIST_MUTATION);
  const [updatePlaylistMutation] = useMutation(UPDATE_PLAYLIST_MUTATION);
  const [deletePlaylistMutation] = useMutation(DELETE_PLAYLIST_MUTATION);
  const [addCourseToPlaylistMutation] = useMutation(
    ADD_COURSE_TO_PLAYLIST_MUTATION
  );
  const [removeCourseFromPlaylistMutation] = useMutation(
    REMOVE_COURSE_FROM_PLAYLIST_MUTATION
  );
  const [reorderPlaylistCoursesMutation] = useMutation(
    REORDER_PLAYLIST_COURSES_MUTATION
  );

  // Créer une playlist
  const createPlaylist = async (input: CreatePlaylistInput) => {
    if (!userId) {
      ToastService.error("Vous devez être connecté");
      return null;
    }

    setIsCreating(true);
    try {
      const { data } = await createPlaylistMutation({
        variables: { input },
        refetchQueries: [
          {
            query: GET_USER_PLAYLISTS_QUERY,
            variables: { userId, page: 1, limit: 20 },
          },
        ],
      });

      ToastService.success("✅ Playlist créée");
      logger.info("Playlist créée", "usePlaylists", data.createPlaylist);
      return data.createPlaylist;
    } catch (error) {
      logger.error("Erreur création playlist", error, "usePlaylists");
      ToastService.error("Erreur lors de la création");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Mettre à jour une playlist
  const updatePlaylist = async (id: string, input: UpdatePlaylistInput) => {
    setIsUpdating(true);
    try {
      const { data } = await updatePlaylistMutation({
        variables: { id, input },
        refetchQueries: [
          { query: GET_PLAYLIST_DETAIL_QUERY, variables: { id } },
        ],
      });

      ToastService.success("✅ Playlist mise à jour");
      logger.info("Playlist mise à jour", "usePlaylists", data.updatePlaylist);
      return data.updatePlaylist;
    } catch (error) {
      logger.error("Erreur mise à jour playlist", error, "usePlaylists");
      ToastService.error("Erreur lors de la mise à jour");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Supprimer une playlist
  const deletePlaylist = async (id: string) => {
    setIsDeleting(true);
    try {
      await deletePlaylistMutation({
        variables: { id },
        refetchQueries: [
          {
            query: GET_USER_PLAYLISTS_QUERY,
            variables: { userId, page: 1, limit: 20 },
          },
        ],
      });

      ToastService.success("🗑️ Playlist supprimée");
      logger.info("Playlist supprimée", "usePlaylists", { id });
      return true;
    } catch (error) {
      logger.error("Erreur suppression playlist", error, "usePlaylists");
      ToastService.error("Erreur lors de la suppression");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Ajouter un cours à une playlist
  const addCourseToPlaylist = async (playlistId: string, courseId: string) => {
    try {
      const { data } = await addCourseToPlaylistMutation({
        variables: { playlistId, courseId },
        refetchQueries: [
          { query: GET_PLAYLIST_DETAIL_QUERY, variables: { id: playlistId } },
        ],
      });

      ToastService.success("✅ Cours ajouté à la playlist");
      logger.info("Cours ajouté à playlist", "usePlaylists", {
        playlistId,
        courseId,
      });
      return data.addCourseToPlaylist;
    } catch (error) {
      logger.error("Erreur ajout cours", error, "usePlaylists");
      ToastService.error("Erreur lors de l'ajout");
      return null;
    }
  };

  // Retirer un cours d'une playlist
  const removeCourseFromPlaylist = async (
    playlistId: string,
    courseId: string
  ) => {
    try {
      const { data } = await removeCourseFromPlaylistMutation({
        variables: { playlistId, courseId },
        refetchQueries: [
          { query: GET_PLAYLIST_DETAIL_QUERY, variables: { id: playlistId } },
        ],
      });

      ToastService.success("🗑️ Cours retiré de la playlist");
      logger.info("Cours retiré de playlist", "usePlaylists", {
        playlistId,
        courseId,
      });
      return data.removeCourseFromPlaylist;
    } catch (error) {
      logger.error("Erreur retrait cours", error, "usePlaylists");
      ToastService.error("Erreur lors du retrait");
      return null;
    }
  };

  // Réorganiser les cours d'une playlist
  const reorderPlaylistCourses = async (
    playlistId: string,
    courseIds: string[]
  ) => {
    try {
      const { data } = await reorderPlaylistCoursesMutation({
        variables: { playlistId, courseIds },
      });

      ToastService.success("✅ Ordre mis à jour");
      logger.info("Cours réorganisés", "usePlaylists", {
        playlistId,
        courseIds,
      });
      return data.reorderPlaylistCourses;
    } catch (error) {
      logger.error("Erreur réorganisation", error, "usePlaylists");
      ToastService.error("Erreur lors de la réorganisation");
      return null;
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
    addCourseToPlaylist,
    removeCourseFromPlaylist,
    reorderPlaylistCourses,
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

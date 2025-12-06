/**
 * Gestion des cours dans les playlists
 * Responsabilité : Add/Remove/Reorder cours uniquement
 */

import {
  ADD_COURSE_TO_PLAYLIST_MUTATION,
  REMOVE_COURSE_FROM_PLAYLIST_MUTATION,
  REORDER_PLAYLIST_COURSES_MUTATION,
} from "@/graphql/mutations/playlists";
import { GET_PLAYLIST_DETAIL_QUERY } from "@/graphql/queries/playlists";
import { logger } from "@/services/logger";
import { ToastService } from "@/services/toastService";
import { useMutation } from "@apollo/client";

export function usePlaylistCourses() {
  const [addCourseToPlaylistMutation] = useMutation(
    ADD_COURSE_TO_PLAYLIST_MUTATION
  );
  const [removeCourseFromPlaylistMutation] = useMutation(
    REMOVE_COURSE_FROM_PLAYLIST_MUTATION
  );
  const [reorderPlaylistCoursesMutation] = useMutation(
    REORDER_PLAYLIST_COURSES_MUTATION
  );

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
    addCourseToPlaylist,
    removeCourseFromPlaylist,
    reorderPlaylistCourses,
  };
}

/**
 * Mutations GraphQL pour les playlists
 * Responsabilité : Opérations CRUD uniquement
 */

import {
  CREATE_PLAYLIST_MUTATION,
  DELETE_PLAYLIST_MUTATION,
  UPDATE_PLAYLIST_MUTATION,
} from "@/graphql/mutations/playlists";
import {
  GET_PLAYLIST_DETAIL_QUERY,
  GET_USER_PLAYLISTS_QUERY,
} from "@/graphql/queries/playlists";
import { logger } from "@/services/logger";
import { ToastService } from "@/services/toastService";
import { useMutation } from "@apollo/client";

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

export function usePlaylistMutations(userId?: string) {
  const [createPlaylistMutation] = useMutation(CREATE_PLAYLIST_MUTATION);
  const [updatePlaylistMutation] = useMutation(UPDATE_PLAYLIST_MUTATION);
  const [deletePlaylistMutation] = useMutation(DELETE_PLAYLIST_MUTATION);

  const createPlaylist = async (input: CreatePlaylistInput) => {
    if (!userId) {
      ToastService.error("Vous devez être connecté");
      return null;
    }

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
    }
  };

  const updatePlaylist = async (id: string, input: UpdatePlaylistInput) => {
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
    }
  };

  const deletePlaylist = async (id: string) => {
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
    }
  };

  return { createPlaylist, updatePlaylist, deletePlaylist };
}

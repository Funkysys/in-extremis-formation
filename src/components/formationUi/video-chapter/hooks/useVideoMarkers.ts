// Hook pour gérer les marqueurs vidéo (chargement, CRUD)

import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  CREATE_MARKER,
  DELETE_MARKER,
  GET_VIDEO_MARKERS,
  UPDATE_MARKER,
} from "../queries";
import { VideoMarker } from "../types";

export function useVideoMarkers(
  videoId: string,
  activeVideoRef: React.RefObject<HTMLVideoElement | null>
) {
  const { showToast } = useToast();
  const [markers, setMarkers] = useState<VideoMarker[]>([]);

  // Chargement des marqueurs existants
  const { loading, error, refetch } = useQuery(GET_VIDEO_MARKERS, {
    variables: {
      videoId: videoId as string,
    },
    skip: !videoId || videoId.startsWith("temp-"),
    onCompleted: (data) => {
      if (!activeVideoRef.current) {
        console.warn("Aucune référence vidéo disponible");
        return;
      }
      if (data?.videoMarkers) {
        console.log("Marqueurs chargés:", data.videoMarkers);
        setMarkers(data.videoMarkers);
      }
    },
    onError: (error) => {
      console.error("Erreur lors du chargement des marqueurs:", error);
    },
  });

  // Mutations
  const [createMarkerMutation] = useMutation(CREATE_MARKER);
  const [updateMarkerMutation] = useMutation(UPDATE_MARKER);
  const [deleteMarkerMutation] = useMutation(DELETE_MARKER);

  // Créer un marqueur
  const createMarker = async (input: {
    videoId: string;
    title: string;
    timestamp: number;
    description?: string;
  }) => {
    try {
      await createMarkerMutation({
        variables: { input },
        update: (cache, { data }) => {
          if (data?.createVideoMarker?.marker) {
            refetch();
          }
        },
      });
      showToast("Marqueur ajouté avec succès", "success");
      return true;
    } catch (err) {
      console.error("Erreur lors de la création du marqueur:", err);
      showToast("Erreur lors de l'ajout du marqueur", "error");
      return false;
    }
  };

  // Mettre à jour un marqueur
  const updateMarker = async (input: {
    id: string;
    videoId: string;
    title: string;
    timestamp: number;
    description?: string;
  }) => {
    try {
      await updateMarkerMutation({
        variables: { input },
      });
      showToast("Marqueur mis à jour avec succès", "success");
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du marqueur:", err);
      showToast("Erreur lors de la mise à jour du marqueur", "error");
      return false;
    }
  };

  // Supprimer un marqueur
  const deleteMarker = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce marqueur ?")) {
      return false;
    }

    try {
      const { data } = await deleteMarkerMutation({ variables: { id } });
      if (data?.deleteVideoMarker?.success) {
        setMarkers(markers.filter((m: VideoMarker) => m.id !== id));
        showToast("Marqueur supprimé avec succès", "success");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors de la suppression du marqueur:", err);
      showToast("Erreur lors de la suppression du marqueur", "error");
      return false;
    }
  };

  return {
    markers,
    setMarkers,
    loading,
    error,
    refetch,
    createMarker,
    updateMarker,
    deleteMarker,
  };
}

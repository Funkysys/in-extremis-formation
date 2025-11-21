"use client";

import { useToast } from "@/providers/ToastProvider";
import { useRef } from "react";

// Imports locaux
import { ChapterForm } from "./ChapterForm";
import {
  ChapterHeader,
  ChapterList,
  ErrorState,
  LoadingState,
} from "./components";
import { useChapterEditor, useVideoMarkers, useVideoTime } from "./hooks";
import { VideoChapterEditorProps } from "./types";

/**
 * Composant principal pour éditer les chapitres d'une vidéo
 * Refactorisé en modules pour une meilleure maintenabilité
 */
export function VideoChapterEditor({
  videoId,
  videoDuration,
  videoRef,
}: VideoChapterEditorProps) {
  const { showToast } = useToast();
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const activeVideoRef = videoRef || internalVideoRef;

  // Hook pour le temps actuel de la vidéo
  const currentTime = useVideoTime(activeVideoRef);

  // Hook pour gérer les marqueurs (CRUD)
  const {
    markers,
    setMarkers,
    loading,
    error,
    refetch,
    createMarker,
    updateMarker,
    deleteMarker,
  } = useVideoMarkers(videoId, activeVideoRef);

  // Hook pour gérer l'état de l'éditeur
  const {
    isEditing,
    currentMarker,
    setCurrentMarker,
    handleCancelEdit,
    handleEditMarker,
    handleAddNewChapter,
    resetEditor,
  } = useChapterEditor(currentTime);

  // Gestion du formulaire de soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMarker?.title || currentMarker.timestamp === undefined) return;

    const input = {
      videoId,
      title: currentMarker.title,
      timestamp: currentMarker.timestamp,
      description: currentMarker.description || "",
    };

    let success = false;
    if (currentMarker.id) {
      // Mise à jour
      success = await updateMarker({ id: currentMarker.id, ...input });
    } else {
      // Création
      success = await createMarker(input);
    }

    if (success) {
      resetEditor();
      refetch();
    }
  };

  // Gestion du réordonnancement des marqueurs
  const handleMarkersReorder = (newMarkers: typeof markers) => {
    setMarkers(newMarkers);
    // TODO: Implémenter mutation de réordonnancement si nécessaire
    showToast("Ordre des chapitres mis à jour", "success");
  };

  // États de chargement et d'erreur
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="space-y-6">
      <ChapterHeader isEditing={isEditing} onAddChapter={handleAddNewChapter} />

      {isEditing && currentMarker && (
        <ChapterForm
          marker={currentMarker}
          videoDuration={videoDuration}
          currentTime={currentTime}
          onMarkerChange={setCurrentMarker}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      )}

      <ChapterList
        markers={markers}
        onMarkersReorder={handleMarkersReorder}
        onEdit={handleEditMarker}
        onDelete={deleteMarker}
      />
    </div>
  );
}

// Hook pour gérer l'état de l'éditeur de chapitres

import { useState } from "react";
import { VideoMarker } from "../types";

export function useChapterEditor(currentTime: number) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentMarker, setCurrentMarker] =
    useState<Partial<VideoMarker> | null>(null);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentMarker(null);
  };

  const handleEditMarker = (marker: VideoMarker) => {
    setCurrentMarker(marker);
    setIsEditing(true);
  };

  const handleAddNewChapter = () => {
    setCurrentMarker({
      title: "",
      timestamp: currentTime,
      description: "",
    });
    setIsEditing(true);
  };

  const resetEditor = () => {
    setCurrentMarker(null);
    setIsEditing(false);
  };

  return {
    isEditing,
    currentMarker,
    setCurrentMarker,
    handleCancelEdit,
    handleEditMarker,
    handleAddNewChapter,
    resetEditor,
  };
}

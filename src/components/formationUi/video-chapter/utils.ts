// Fonctions utilitaires pour les chapitres vidéo

import { VideoMarker } from "./types";

/**
 * Formater le temps (secondes en MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Trier les marqueurs par timestamp
 */
export const sortMarkers = (a: VideoMarker, b: VideoMarker): number => {
  return a.timestamp - b.timestamp;
};

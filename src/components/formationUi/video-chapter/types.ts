// Types partagés pour les chapitres vidéo

export type VideoMarker = {
  id: string;
  title: string;
  timestamp: number;
  description?: string | null;
};

export interface VideoChapterEditorProps {
  videoId: string; // UUID format
  videoDuration: number;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

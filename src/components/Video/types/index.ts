export interface VideoChapter {
  id: string;
  title: string;
  timestamp: number;
  description?: string;
}

export interface VideoPlayerProps {
  src: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  chapters?: VideoChapter[];
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onChapterSelect?: (chapter: VideoChapter) => void;
}

export interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  chapters?: VideoChapter[];
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onForward: (seconds: number) => void;
  onBackward: (seconds: number) => void;
  onAddChapter?: () => void;
  onChapterClick?: (chapter: VideoChapter) => void;
}

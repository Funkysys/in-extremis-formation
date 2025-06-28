import { VideoChapter } from '../types';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  chapters?: VideoChapter[];
  onSeek: (time: number) => void;
  onChapterClick?: (chapter: VideoChapter) => void;
  className?: string;
}

export function ProgressBar({
  currentTime,
  duration,
  chapters = [],
  onSeek,
  onChapterClick,
  className = '',
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    onSeek(newTime);
  };

  return (
    <div className={`relative h-1.5 bg-gray-600 rounded-full cursor-pointer group ${className}`} onClick={handleClick}>
      <div 
        className="absolute top-0 left-0 h-full bg-red-500 rounded-full group-hover:bg-red-400 transition-colors"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {chapters.map((chapter) => {
        const position = (chapter.timestamp / duration) * 100;
        return (
          <div 
            key={chapter.id}
            className="absolute top-1/2 w-2 h-2 -mt-1 -ml-1 bg-white rounded-full cursor-pointer hover:scale-150 transition-transform"
            style={{ left: `${position}%` }}
            title={`${chapter.title} (${formatTime(chapter.timestamp)})`}
            onClick={(e) => {
              e.stopPropagation();
              onChapterClick?.(chapter);
            }}
          />
        );
      })}
    </div>
  );
}

// Fonction utilitaire pour formater le temps
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

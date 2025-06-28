import { VideoChapter } from '../types';

interface ChapterListProps {
  chapters: VideoChapter[];
  currentTime: number;
  onChapterClick: (chapter: VideoChapter) => void;
  onDeleteChapter?: (chapterId: string) => void;
}

export function ChapterList({
  chapters,
  currentTime,
  onChapterClick,
  onDeleteChapter,
}: ChapterListProps) {
  if (chapters.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Aucun chapitre pour le moment
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {chapters
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((chapter) => (
          <div 
            key={chapter.id}
            className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
              currentTime >= chapter.timestamp && currentTime < (chapter.timestamp + 5) ? 'bg-blue-50' : ''
            }`}
            onClick={() => onChapterClick(chapter)}
          >
            <div>
              <div className="font-medium text-gray-900">{chapter.title}</div>
              <div className="text-sm text-gray-500">
                {formatTime(chapter.timestamp)}
                {chapter.description && ` • ${chapter.description}`}
              </div>
            </div>
            
            {onDeleteChapter && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChapter(chapter.id);
                }}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer le chapitre"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

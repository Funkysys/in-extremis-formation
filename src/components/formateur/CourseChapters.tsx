import React, { useState } from 'react';
import { VideoChapter } from './types/create-course.types';

interface CourseChaptersProps {
  chapters: VideoChapter[];
  currentTime: number;
  onUpdateChapter: (id: string, title: string) => void;
  onDeleteChapter: (id: string) => void;
  onChapterClick?: (timestamp: number) => void;
  onAddChapter?: (title: string) => void;
  className?: string;
  disabled?: boolean;
}

export const CourseChapters: React.FC<CourseChaptersProps> = ({
  chapters,
  currentTime,
  onUpdateChapter,
  onDeleteChapter,
  onChapterClick,
  onAddChapter,
  className = '',
  disabled = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditStart = (chapter: VideoChapter) => {
    if (disabled) return;
    setEditingId(chapter.id);
    setEditTitle(chapter.title);
  };

  const handleEditSave = (id: string) => {
    if (editTitle.trim()) {
      onUpdateChapter(id, editTitle);
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditTitle('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      
      {chapters.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No chapters yet</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                Math.abs(chapter.timestamp - currentTime) < 1 
                  ? 'bg-blue-900/30 ring-1 ring-blue-500/50' 
                  : 'bg-gray-800 hover:bg-gray-750'
              }`}
            >
              {editingId === chapter.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, chapter.id)}
                  onBlur={() => handleEditSave(chapter.id)}
                  className="flex-1 px-2 py-1 bg-gray-700 text-white rounded border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => !disabled && onChapterClick?.(chapter.timestamp)}
                  onDoubleClick={() => handleEditStart(chapter)}
                  className={`flex-1 text-left transition-colors ${
                    disabled ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:text-blue-400 cursor-pointer'
                  }`}
                  type="button"
                  disabled={disabled}
                >
                  {chapter.title}
                </button>
              )}
              
              <span className={`text-sm w-16 text-right ${
                disabled ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {formatTime(chapter.timestamp)}
              </span>
              
              {!disabled && (
                <div className="flex space-x-1">
                  {editingId !== chapter.id && (
                    <button
                      onClick={() => handleEditStart(chapter)}
                      className="p-1 text-blue-500 hover:text-blue-400"
                      type="button"
                      title="Edit chapter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteChapter(chapter.id)}
                    className="p-1 text-red-500 hover:text-red-400"
                    type="button"
                    title="Delete chapter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Chapter } from '../types';
import { formatTime } from '@/utils/formatTime';

interface ChaptersListProps {
  chapters: Chapter[];
  currentTime: number;
  onAddChapter: (title: string) => void;
  onUpdateChapter: (id: string, title: string) => void;
  onDeleteChapter: (id: string) => void;
  onChapterClick: (timestamp: number) => void;
}

export function ChaptersList({
  chapters,
  currentTime,
  onAddChapter,
  onUpdateChapter,
  onDeleteChapter,
  onChapterClick
}: ChaptersListProps) {
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      onAddChapter(newChapterTitle.trim());
      setNewChapterTitle('');
    }
  };

  const startEditing = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditTitle(chapter.title);
  };

  const saveChapterEdit = () => {
    if (editingChapterId && editTitle.trim()) {
      onUpdateChapter(editingChapterId, editTitle.trim());
      setEditingChapterId(null);
    }
  };

  const cancelEditing = () => {
    setEditingChapterId(null);
  };

  const sortedChapters = [...chapters].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Chapters</h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="Chapter title"
          className="flex-1 p-2 border rounded bg-gray-700 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Empêche la soumission du formulaire parent
              handleAddChapter();
            }
          }}
        />
        <button 
          type="button" // Important: type="button" pour éviter la soumission du formulaire parent
          onClick={handleAddChapter}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add at {formatTime(currentTime)}
        </button>
      </div>

      {sortedChapters.length > 0 ? (
        <ul className="space-y-2">
          {sortedChapters.map((chapter) => (
            <li 
              key={chapter.id} 
              className={`p-3 rounded border ${
                Math.abs(chapter.timestamp - currentTime) < 0.5 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              {editingChapterId === chapter.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-1 border rounded bg-gray-700 text-white"
                    autoFocus
                  />
                  <button 
                    onClick={saveChapterEdit}
                    className="p-1 text-green-500 hover:text-green-400"
                  >
                    Save
                  </button>
                  <button 
                    onClick={cancelEditing}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onChapterClick(chapter.timestamp)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      {formatTime(chapter.timestamp)}
                    </button>
                    <span className="font-medium">{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEditing(chapter)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteChapter(chapter.id)}
                      className="p-1 text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">No chapters added yet</p>
      )}
    </div>
  );
}

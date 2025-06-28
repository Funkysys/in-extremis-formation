import { useState } from 'react';

interface AddChapterFormProps {
  currentTime: number;
  onAddChapter: (title: string, timestamp: number, description?: string) => void;
  onCancel: () => void;
}

export function AddChapterForm({
  currentTime,
  onAddChapter,
  onCancel,
}: AddChapterFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddChapter(title.trim(), currentTime, description.trim() || undefined);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-3">Ajouter un chapitre</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="chapter-title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre du chapitre *
          </label>
          <input
            id="chapter-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Introduction"
            required
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="chapter-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optionnel)
          </label>
          <textarea
            id="chapter-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Description du chapitre"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Position: {formatTime(currentTime)}
          </div>
          
          <div className="space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

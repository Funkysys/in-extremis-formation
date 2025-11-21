// En-tête de l'éditeur de chapitres avec bouton d'ajout

interface ChapterHeaderProps {
  isEditing: boolean;
  onAddChapter: () => void;
}

export function ChapterHeader({ isEditing, onAddChapter }: ChapterHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Chapitres de la vidéo</h3>
      {!isEditing && (
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          onClick={onAddChapter}
        >
          <span className="mr-2">+</span>
          Ajouter un chapitre
        </button>
      )}
    </div>
  );
}

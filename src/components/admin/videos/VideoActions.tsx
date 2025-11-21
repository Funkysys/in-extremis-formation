// Composant: VideoActions - Actions sur une vidéo

interface VideoActionsProps {
  videoId: string;
  title: string;
  isPublished: boolean;
  isPremium: boolean;
  onTogglePublish: (videoId: string, currentStatus: boolean) => void;
  onTogglePremium: (videoId: string, currentStatus: boolean) => void;
  onApprove: (videoId: string) => void;
  onDelete: (videoId: string, title: string) => void;
}

export const VideoActions = ({
  videoId,
  title,
  isPublished,
  isPremium,
  onTogglePublish,
  onTogglePremium,
  onApprove,
  onDelete,
}: VideoActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => onTogglePublish(videoId, isPublished)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
            isPublished
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {isPublished ? "🚫 Dépublier" : "✅ Publier"}
        </button>
        <button
          onClick={() => onTogglePremium(videoId, isPremium)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
            isPremium
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }`}
        >
          {isPremium ? "Gratuit" : "⭐ Premium"}
        </button>
      </div>
      <div className="flex gap-2">
        {!isPublished && (
          <button
            onClick={() => onApprove(videoId)}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
          >
            👍 Approuver
          </button>
        )}
        <button
          onClick={() => onDelete(videoId, title)}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

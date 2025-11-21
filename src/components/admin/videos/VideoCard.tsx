// Composant: VideoCard - Carte d'une vidéo

import { AdminVideo } from "@/lib/admin/types";
import { formatDuration } from "@/lib/admin/utils";
import { VideoActions } from "./VideoActions";

interface VideoCardProps {
  video: AdminVideo;
  onTogglePublish: (videoId: string, currentStatus: boolean) => void;
  onTogglePremium: (videoId: string, currentStatus: boolean) => void;
  onApprove: (videoId: string) => void;
  onDelete: (videoId: string, title: string) => void;
}

export const VideoCard = ({
  video,
  onTogglePublish,
  onTogglePremium,
  onApprove,
  onDelete,
}: VideoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {video.is_published ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
              Publiée
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
              Brouillon
            </span>
          )}
          {video.is_premium && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
              ⭐ Premium
            </span>
          )}
        </div>

        {/* Durée */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <p className="text-xs text-gray-500 mb-4">
          Créée le {new Date(video.createdAt).toLocaleDateString("fr-FR")}
        </p>

        <VideoActions
          videoId={video.id}
          title={video.title}
          isPublished={video.is_published}
          isPremium={video.is_premium}
          onTogglePublish={onTogglePublish}
          onTogglePremium={onTogglePremium}
          onApprove={onApprove}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

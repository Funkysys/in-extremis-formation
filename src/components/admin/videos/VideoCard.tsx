// Composant: VideoCard - Carte d'une vidéo

import { AdminVideo } from "@/lib/admin/types";
import { formatDuration } from "@/lib/admin/utils";
import Image from "next/image";
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
    <div className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative bg-gray-200 aspect-video">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute flex gap-2 top-2 left-2">
          {video.is_published ? (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
              Publiée
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded">
              Brouillon
            </span>
          )}
          {video.is_premium && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded">
              ⭐ Premium
            </span>
          )}
        </div>

        {/* Durée */}
        {video.duration && (
          <div className="absolute px-2 py-1 text-xs text-white bg-black bg-opacity-75 rounded bottom-2 right-2">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        )}
        <p className="mb-4 text-xs text-gray-500">
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

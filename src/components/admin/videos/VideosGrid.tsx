// Composant: VideosGrid - Grille de vidéos

import { AdminVideo } from "@/lib/admin/types";
import { VideoCard } from "./VideoCard";

interface VideosGridProps {
  videos: AdminVideo[];
  onTogglePublish: (videoId: string, currentStatus: boolean) => void;
  onTogglePremium: (videoId: string, currentStatus: boolean) => void;
  onApprove: (videoId: string) => void;
  onDelete: (videoId: string, title: string) => void;
}

export const VideosGrid = ({
  videos,
  onTogglePublish,
  onTogglePremium,
  onApprove,
  onDelete,
}: VideosGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onTogglePublish={onTogglePublish}
          onTogglePremium={onTogglePremium}
          onApprove={onApprove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

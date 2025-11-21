"use client";

import { AdminHeader } from "@/components/admin/shared/AdminHeader";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { VideosFilters } from "@/components/admin/videos/VideosFilters";
import { VideosGrid } from "@/components/admin/videos/VideosGrid";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import { useVideosModeration } from "@/hooks/admin/useVideosModeration";

export default function VideosModerationPage() {
  const { isLoading, isAdmin } = useAdminAuth();
  const {
    filteredVideos,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    handleTogglePublish,
    handleTogglePremium,
    handleApprove,
    handleDelete,
  } = useVideosModeration();

  if (isLoading || !isAdmin) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader
          title="Modération des Vidéos"
          description={`${filteredVideos.length} vidéo${
            filteredVideos.length > 1 ? "s" : ""
          } trouvée${filteredVideos.length > 1 ? "s" : ""}`}
        />

        <VideosFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <EmptyState message="Aucune vidéo trouvée" />
        ) : (
          <VideosGrid
            videos={filteredVideos}
            onTogglePublish={handleTogglePublish}
            onTogglePremium={handleTogglePremium}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { CreatePlaylistModal, PlaylistCard } from "@/components/playlists";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { useState } from "react";

export default function PlaylistsPage() {
  const { user } = useAuth();
  const {
    playlists,
    loadingPlaylists,
    createPlaylist,
    deletePlaylist,
    isCreating,
  } = usePlaylists(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (data: {
    name: string;
    description?: string;
    isPublic: boolean;
  }) => {
    await createPlaylist(data);
  };

  const handleDelete = async (id: string) => {
    await deletePlaylist(id);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Connectez-vous pour voir vos playlists
          </p>
          <Link
            href="/auth/callback"
            className="text-blue-600 hover:text-blue-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Mes Playlists
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Organisez vos cours en playlists personnalisées
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle playlist
        </button>
      </div>

      {/* Loading */}
      {loadingPlaylists && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            Chargement...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loadingPlaylists && playlists.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📚</span>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Aucune playlist pour le moment
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Créez votre première playlist pour organiser vos cours
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer ma première playlist
          </button>
        </div>
      )}

      {/* Playlists grid */}
      {!loadingPlaylists && playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {playlists.map((playlist: any) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDelete}
              onEdit={(playlist) => {
                // TODO: Implement edit modal
                console.log("Edit playlist:", playlist);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        isLoading={isCreating}
      />
    </div>
  );
}

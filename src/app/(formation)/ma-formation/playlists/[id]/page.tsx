"use client";

import { PlaylistCoursesList } from "@/components/playlists";
import {
  REMOVE_COURSE_FROM_PLAYLIST_MUTATION,
  REORDER_PLAYLIST_COURSES_MUTATION,
} from "@/graphql/mutations/playlists";
import { GET_PLAYLIST_DETAIL_QUERY } from "@/graphql/queries/playlists";
import { usePlaylistDetail } from "@/hooks/user";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { use, useState } from "react";

interface PlaylistDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PlaylistDetailPage({
  params,
}: PlaylistDetailPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const { playlist, loading } = usePlaylistDetail(id);
  const [isEditing, setIsEditing] = useState(false);

  const [removeCourseFromPlaylist] = useMutation(
    REMOVE_COURSE_FROM_PLAYLIST_MUTATION
  );
  const [reorderPlaylistCourses] = useMutation(
    REORDER_PLAYLIST_COURSES_MUTATION
  );

  const handleReorder = async (courseIds: string[]) => {
    await reorderPlaylistCourses({
      variables: { playlistId: id, courseIds },
      refetchQueries: [{ query: GET_PLAYLIST_DETAIL_QUERY, variables: { id } }],
    });
  };

  const handleRemove = async (courseId: string) => {
    await removeCourseFromPlaylist({
      variables: { playlistId: id, courseId },
      refetchQueries: [{ query: GET_PLAYLIST_DETAIL_QUERY, variables: { id } }],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Playlist introuvable
          </p>
          <Link
            href="/ma-formation/playlists"
            className="text-blue-600 hover:text-blue-700"
          >
            Retour aux playlists
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === playlist.owner?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/ma-formation/playlists"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux playlists
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {playlist.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span>{playlist.coursesCount} cours</span>
              <span>•</span>
              <span>{playlist.isPublic ? "🌍 Publique" : "🔒 Privée"}</span>
              {playlist.owner && (
                <>
                  <span>•</span>
                  <span>Par {playlist.owner.username}</span>
                </>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${
                    isEditing
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-200 dark:bg-gray-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                {isEditing ? "✓ Terminer" : "✏️ Modifier"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions for editing */}
      {isEditing && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Mode édition :</strong> Glissez-déposez les cours pour les
            réorganiser. Cliquez sur le ✕ pour retirer un cours.
          </p>
        </div>
      )}

      {/* Courses list */}
      <PlaylistCoursesList
        courses={playlist.courses || []}
        playlistId={id}
        onReorder={handleReorder}
        onRemove={handleRemove}
        isEditable={isOwner && isEditing}
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coursesCount: number;
  thumbnail?: string;
  isPublic: boolean;
  courses?: Array<{
    id: string;
    thumbnail?: string;
  }>;
}

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete?: (id: string) => void;
  onEdit?: (playlist: Playlist) => void;
}

export default function PlaylistCard({
  playlist,
  onDelete,
  onEdit,
}: PlaylistCardProps) {
  const thumbnails = playlist.courses?.slice(0, 4) || [];
  const hasThumbnails = thumbnails.length > 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/ma-formation/playlists/${playlist.id}`}>
        {/* Thumbnail Grid */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
          {hasThumbnails ? (
            <div
              className={`grid ${
                thumbnails.length === 1 ? "grid-cols-1" : "grid-cols-2"
              } gap-0.5 h-full`}
            >
              {thumbnails.map((course, idx) => (
                <div key={course.id} className="relative w-full h-full">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={`Course ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-300 dark:bg-slate-700">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-6xl mb-2">📚</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Playlist vide
              </p>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
              {playlist.coursesCount} cours
            </span>
            {!playlist.isPublic && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-500 text-black rounded">
                🔒 Privée
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-white line-clamp-1 mb-1">
            {playlist.name}
          </h3>
          {playlist.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {playlist.description}
            </p>
          )}
        </div>
      </Link>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit(playlist);
              }}
              className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors"
              title="Modifier"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Supprimer cette playlist ?")) {
                  onDelete(playlist.id);
                }
              }}
              className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Supprimer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

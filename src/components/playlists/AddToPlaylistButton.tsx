"use client";

import { usePlaylists } from "@/hooks/user";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddToPlaylistButtonProps {
  courseId: string;
  courseTitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function AddToPlaylistButton({
  courseId,
  courseTitle,
  size = "md",
  className = "",
}: AddToPlaylistButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { playlists, addCourseToPlaylist, loadingPlaylists } = usePlaylists(
    user?.id
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const iconSize = iconSizes[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/auth/callback");
      return;
    }

    setIsOpen(!isOpen);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    setIsAdding(true);
    await addCourseToPlaylist(playlistId, courseId);
    setIsAdding(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={loadingPlaylists || isAdding}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-white/80 backdrop-blur-sm
          hover:bg-white
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:scale-110
          ${className}
        `}
        title="Ajouter à une playlist"
        aria-label="Ajouter à une playlist"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-slate-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-white">
              Ajouter à une playlist
            </h3>
            {courseTitle && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                {courseTitle}
              </p>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loadingPlaylists ? (
              <div className="p-4 text-center text-sm text-slate-600 dark:text-slate-400">
                Chargement...
              </div>
            ) : playlists.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Aucune playlist
                </p>
                <button
                  onClick={() => router.push("/ma-formation/playlists")}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Créer une playlist
                </button>
              </div>
            ) : (
              <ul className="py-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {playlists.map((playlist: any) => (
                  <li key={playlist.id}>
                    <button
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      disabled={isAdding}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 dark:text-white line-clamp-1">
                          {playlist.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                          {playlist.coursesCount}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-2 border-t border-slate-200 dark:border-gray-700">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/ma-formation/playlists");
              }}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              + Nouvelle playlist
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

"use client";

import CourseCard from "@/components/formationUi/CourseCard";
import { GET_USER_LIKES_QUERY } from "@/graphql/queries/likes";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

export default function FavorisPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const { data, loading, error } = useQuery(GET_USER_LIKES_QUERY, {
    variables: { limit, offset },
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4" />
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2" />
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          Erreur lors du chargement de vos favoris
        </div>
      </div>
    );
  }

  const likes = data?.userLikes?.likes || [];
  const total = data?.userLikes?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {total} formation{total > 1 ? "s" : ""} dans vos favoris
        </p>
      </div>

      {likes.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explorez nos formations et ajoutez vos préférées à vos favoris
          </p>
          <Link
            href="/formation"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Découvrir les formations
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likes.map(
              (like: {
                id: string;
                course: {
                  id: string;
                  title: string;
                  thumbnail: string;
                  description: string;
                  instructor: { username: string };
                  likesCount: number;
                  isLikedByUser: boolean;
                };
              }) => (
                <CourseCard key={like.id} formation={like.course as never} />
              )
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Précédent
              </button>

              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {page} sur {totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

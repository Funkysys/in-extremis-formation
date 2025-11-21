"use client";

import CourseCard from "@/components/formationUi/CourseCard";

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  [key: string]: unknown;
}

interface SearchResultsProps {
  courses: Course[];
  loading: boolean;
  totalCount: number;
  query?: string;
  emptyMessage?: string;
}

export default function SearchResults({
  courses,
  loading,
  totalCount,
  query,
  emptyMessage = "Aucune formation trouvée",
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Recherche en cours...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        {query && (
          <p className="text-slate-600 dark:text-slate-400">
            Aucun résultat pour &quot;{query}&quot;
          </p>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
          Essayez avec d&apos;autres mots-clés ou modifiez vos filtres
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {totalCount} formation{totalCount > 1 ? "s" : ""} trouvée
          {totalCount > 1 ? "s" : ""}
          {query && (
            <span className="font-medium text-slate-800 dark:text-white ml-1">
              pour &quot;{query}&quot;
            </span>
          )}
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} formation={course as never} />
        ))}
      </div>
    </div>
  );
}

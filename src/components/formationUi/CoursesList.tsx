"use client";

import type { Course } from "@/types/course";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";
import SearchAndFilter from "./SearchAndFilter";

interface Filters {
  category: string;
  level: string;
  sort: string;
}

interface CoursesListProps {
  courses: Course[];
  loading: boolean;
  error: Error | { message?: string } | null;
  searchTerm: string;
  onSearch: (term: string) => void;
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

export default function CoursesList({
  courses,
  loading,
  error,
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  pagination,
}: CoursesListProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearch={onSearch}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          Une erreur est survenue lors du chargement des formations.
          {error.message && <p className="text-sm mt-2">{error.message}</p>}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-300">
            Aucune formation trouvée
          </h2>
          <p className="text-slate-400 mt-2">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="h-full">
                <CourseCard formation={course} />
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
              <div className="mt-4 text-center text-sm text-slate-400">
                Affichage de{" "}
                {Math.min(
                  (pagination.currentPage - 1) * pagination.itemsPerPage + 1,
                  pagination.totalItems
                )}{" "}
                à{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                sur {pagination.totalItems} formations
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

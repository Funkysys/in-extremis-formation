"use client";

import type { Course } from "@/types/course";
import { CoursesGrid } from "./CoursesList/CoursesGrid";
import { EmptyState } from "./CoursesList/EmptyState";
import { ErrorState } from "./CoursesList/ErrorState";
import { LoadingState } from "./CoursesList/LoadingState";
import { PaginationInfo } from "./CoursesList/PaginationInfo";
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
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : courses.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <CoursesGrid courses={courses} />

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
              <PaginationInfo
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

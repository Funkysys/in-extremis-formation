"use client";

import FormationMenu from "@/components/formationUi/FormationMenu";
import Pagination from "@/components/formationUi/Pagination";
import {
  FilterState,
  SearchBar,
  SearchFilters,
  SearchResults,
} from "@/components/search";
import { useSearchCourses } from "@/hooks/useSearchCourses";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 12;

export default function FormationPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const {
    courses,
    totalCount,
    loading,
    filters,
    page,
    pageSize,
    setSearchQuery,
    updateFilters,
    goToPage,
  } = useSearchCourses({
    initialFilters: { query: initialQuery },
    pageSize: ITEMS_PER_PAGE,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    updateFilters(newFilters);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-sky-900 text-white">
      <FormationMenu />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Catalogue des formations
          </h1>
          <p className="text-gray-300">
            Découvrez nos formations professionnelles
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.query || ""}
            onChange={setSearchQuery}
            placeholder="Rechercher une formation (instrument, style, artiste...)"
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilters
              activeFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <SearchResults
              courses={courses}
              loading={loading}
              totalCount={totalCount}
              query={filters.query}
            />

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

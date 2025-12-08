"use client";

import { SEARCH_COURSES_QUERY } from "@/graphql/queries/search";
import { logger } from "@/services/logger";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

interface SearchFilters {
  query?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  sortBy?: string;
}

interface UseSearchCoursesOptions {
  initialFilters?: SearchFilters;
  debounceMs?: number;
  pageSize?: number;
}

export const useSearchCourses = ({
  initialFilters = {},
  debounceMs = 300,
  pageSize = 12,
}: UseSearchCoursesOptions = {}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] =
    useState<SearchFilters>(initialFilters);
  const [page, setPage] = useState(1);

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // Reset page when filters change
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [filters, debounceMs]);

  // GraphQL query
  const { data, loading, error, refetch, fetchMore } = useQuery(
    SEARCH_COURSES_QUERY,
    {
      variables: {
        ...debouncedFilters,
        page,
        limit: pageSize,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Update search query
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
    logger.info("Recherche mise à jour", "useSearchCourses", { query });
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    logger.info("Filtres mis à jour", "useSearchCourses", newFilters);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    logger.info("Filtres réinitialisés", "useSearchCourses");
  }, []);

  // Load more
  const loadMore = useCallback(async () => {
    if (!data?.searchCourses?.hasMore) return;

    try {
      await fetchMore({
        variables: {
          page: page + 1,
        },
      });
      setPage((prev) => prev + 1);
    } catch (err) {
      logger.error("Erreur chargement plus", err, "useSearchCourses");
    }
  }, [data, fetchMore, page]);

  // Go to page
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    courses: data?.searchCourses?.courses || [],
    totalCount: data?.searchCourses?.totalCount || 0,
    hasMore: data?.searchCourses?.hasMore || false,
    facets: data?.searchCourses?.facets,
    loading,
    error,
    filters,
    debouncedFilters,
    page,
    pageSize,
    setSearchQuery,
    updateFilters,
    clearFilters,
    loadMore,
    goToPage,
    refetch,
  };
};

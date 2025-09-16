"use client";

import { Course, FilterOptions, PaginationInfo } from "@/types/course";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import CoursesList from "./CoursesList";

interface CoursesClientProps {
  initialCourses: Course[];
  initialFilters: FilterOptions;
  initialPagination: Omit<PaginationInfo, "currentPage"> & {
    currentPage: number;
  };
}

export default function CoursesClient({
  initialCourses,
  initialFilters,
  initialPagination,
}: CoursesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState(initialCourses);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Mettre à jour les états quand les props changent (SSR -> Hydratation)
  useEffect(() => {
    setIsLoading(true);
    setCourses(initialCourses);
    setPagination(initialPagination);
    setFilters(initialFilters);
    setIsLoading(false);
  }, [initialCourses, initialPagination, initialFilters]);

  // Mettre à jour l'URL avec les filtres actuels
  const updateUrl = useCallback(
    (newFilters: Partial<FilterOptions>, newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      // Mettre à jour les paramètres de filtres
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === "all" || !value) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Mettre à jour la page
      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }

      // Mettre à jour l'URL sans recharger la page
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Utiliser replace pour éviter d'ajouter une entrée à l'historique
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Gérer la recherche
  const handleSearch = useCallback(
    (term: string) => {
      const newFilters = { ...filters };
      updateUrl({ ...newFilters, search: term }, 1);
    },
    [filters, updateUrl]
  );

  // Gérer les changements de filtre
  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterOptions>) => {
      updateUrl({ ...filters, ...newFilters }, 1);
    },
    [filters, updateUrl]
  );

  // Gérer le changement de page
  const handlePageChange = useCallback(
    (page: number) => {
      updateUrl({}, page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateUrl]
  );

  // Filtrer et trier les cours côté client
  const processedCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Filtre par terme de recherche
        const matchesSearch =
          !filters.search ||
          course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          (course.description &&
            course.description
              .toLowerCase()
              .includes(filters.search.toLowerCase()));

        // Filtre par catégorie (champ optionnel)
        const matchesCategory =
          filters.category === "all" ||
          (course.category && course.category === filters.category);

        // Filtre par niveau (champ optionnel)
        const matchesLevel =
          filters.level === "all" ||
          (course.level && course.level === filters.level);

        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        // Trier les cours
        switch (filters.sort) {
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "price_asc":
            return (a.price || 0) - (b.price || 0);
          case "price_desc":
            return (b.price || 0) - (a.price || 0);
          case "newest":
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
  }, [courses, filters]);

  // Calculer la pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return processedCourses.slice(startIndex, endIndex);
  }, [processedCourses, pagination]);

  // Mettre à jour la pagination quand les résultats changent
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalItems: processedCourses.length,
      totalPages: Math.ceil(processedCourses.length / prev.itemsPerPage),
    }));
  }, [processedCourses]);

  return (
    <CoursesList
      courses={paginatedCourses}
      loading={isLoading}
      error={null}
      searchTerm={filters.search || ""}
      onSearch={handleSearch}
      filters={filters}
      onFilterChange={handleFilterChange}
      pagination={{
        ...pagination,
        totalItems: processedCourses.length,
        totalPages: Math.ceil(
          processedCourses.length / pagination.itemsPerPage
        ),
        onPageChange: handlePageChange,
      }}
    />
  );
}

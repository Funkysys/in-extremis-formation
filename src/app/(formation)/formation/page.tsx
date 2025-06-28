'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { COURSES_QUERY } from "@/graphql/queries/course-queries";
import { Course, FilterOptions } from "@/types/course";
import CoursesClient from "@/components/formationUi/CoursesClient";
import FormationMenu from "@/components/formationUi/FormationMenu";

const ITEMS_PER_PAGE = 12;

export default function FormationPage() {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  
  const filters: FilterOptions = {
    category: searchParams.get('category') || 'all',
    level: searchParams.get('level') || 'all',
    sort: searchParams.get('sort') || 'newest',
  };

  const { data, loading, error } = useQuery(COURSES_QUERY, {
    variables: { publishedOnly: true },
    fetchPolicy: 'cache-first',
  });

  const courses: Course[] = data?.courses || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-900 text-white p-8">
        <p>Chargement des formations...</p>
      </div>
    );
  }

  if (error) {
    console.error('Erreur lors du chargement des formations:', error);
    return (
      <div className="min-h-screen bg-sky-900 text-white p-8">
        <p className="text-red-500">Une erreur est survenue lors du chargement des formations.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-900 text-white">
      <FormationMenu />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Catalogue des formations</h1>
          <p className="text-gray-300">Découvrez nos formations professionnelles</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <CoursesClient 
            initialCourses={courses}
            initialFilters={filters}
            initialPagination={{
              currentPage,
              totalPages: Math.ceil(courses.length / ITEMS_PER_PAGE),
              totalItems: courses.length,
              itemsPerPage: ITEMS_PER_PAGE,
            }}
          />
        </div>
      </div>
    </div>
  );
}

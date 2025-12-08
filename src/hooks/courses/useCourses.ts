import { gql, useQuery } from '@apollo/client';

const COURSES_QUERY = gql`
  query Courses($publishedOnly: Boolean, $search: String, $category: String, $level: String, $sort: String) {
    courses(
      publishedOnly: $publishedOnly,
      search: $search,
      category: $category,
      level: $level,
      sort: $sort
    ) {
      id
      title
      description
      imageUrl
      price
      level
      category
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  level: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseCoursesOptions {
  search?: string;
  category?: string;
  level?: string;
  sort?: string;
  skip?: boolean;
}

export function useCourses(options: UseCoursesOptions = {}) {
  const { search, category, level, sort, skip } = options;
  
  return useQuery<{ courses: Course[] }>(
    COURSES_QUERY,
    {
      variables: {
        publishedOnly: true,
        ...(search && { search }),
        ...(category && category !== 'all' && { category }),
        ...(level && level !== 'all' && { level }),
        sort: sort || 'newest',
      },
      fetchPolicy: 'network-only',
      skip,
    }
  );
}

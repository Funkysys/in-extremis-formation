import { gql } from "@apollo/client";

export const SEARCH_COURSES_QUERY = gql`
  query SearchCourses(
    $query: String
    $category: String
    $level: String
    $minPrice: Float
    $maxPrice: Float
    $minDuration: Int
    $maxDuration: Int
    $sortBy: String
    $page: Int
    $limit: Int
  ) {
    searchCourses(
      query: $query
      category: $category
      level: $level
      minPrice: $minPrice
      maxPrice: $maxPrice
      minDuration: $minDuration
      maxDuration: $maxDuration
      sortBy: $sortBy
      page: $page
      limit: $limit
    ) {
      courses {
        id
        title
        description
        thumbnail
        coverImage {
          url
          altText
        }
        price
        duration
        level
        category
        instructor {
          id
          username
          avatar
        }
        isPublished
        likesCount
        isLikedByUser
        enrollmentCount
        rating
        createdAt
        updatedAt
      }
      totalCount
      hasMore
      facets {
        categories {
          name
          count
        }
        levels {
          name
          count
        }
        priceRanges {
          min
          max
          count
        }
      }
    }
  }
`;

export const GET_SEARCH_SUGGESTIONS_QUERY = gql`
  query GetSearchSuggestions($query: String!, $limit: Int) {
    searchSuggestions(query: $query, limit: $limit) {
      suggestions
      courses {
        id
        title
        thumbnail
      }
    }
  }
`;


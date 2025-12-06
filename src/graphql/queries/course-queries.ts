import { gql } from "@apollo/client";

export const COURSES_QUERY = gql`
  query Courses($publishedOnly: Boolean) {
    courses(publishedOnly: $publishedOnly) {
      id
      title
      description
      price
      isPublished
      createdAt
      updatedAt
      image {
        url
        altText
      }
      chapters {
        id
        title
        description
        order
        videos {
          id
          title
          description
          url
          duration
          order
          thumbnail {
            url
            altText
          }
        }
      }
    }
  }
`;

export const COURSE_QUERY = gql`
  query($id: UUID!) {
    course(id: $id) {
      id
      title
      description
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export const COURSE_BY_TITLE_QUERY = gql`
  query($title: String!) {
    courseByTitle(title: $title) {
      id
      title
      description
      isPublished
      createdAt
      updatedAt
    }
  }
`;

// Query pour récupérer les cours du formateur connecté
export const MY_COURSES_QUERY = gql`
  query {
    myCourses {
      id
      title
      description
      price
      isPublished
      createdAt
      updatedAt
      image {
        url
        altText
      }
      chapters {
        id
        title
        description
        order
        videos {
          id
          title
          description
          url
          duration
          order
          thumbnail {
            url
            altText
          }
        }
      }
    }
  }
`;


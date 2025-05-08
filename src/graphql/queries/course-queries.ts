// Toutes les queries course prêtes à l'emploi

import { gql } from "@apollo/client";

export const COURSES_QUERY = gql`
  query($published_only: Boolean) {
    courses(published_only: $published_only) {
      id
      slug
      title
      description
      published
      createdAt
      updatedAt
      author {
        id
        fullName
      }
    }
  }
`;

export const COURSE_QUERY = gql`
  query($id: UUID!) {
    course(id: $id) {
      id
      slug
      title
      description
      published
      createdAt
      updatedAt
      author {
        id
        fullName
      }
    }
  }
`;

import { gql } from "@apollo/client";

// List chapters by course
export const CHAPTERS_BY_COURSE_QUERY = gql`
  query($courseId: UUID!) {
    chapters(courseId: $courseId) {
      id
      title
      description
      order
      image_id
      videos {
        id
        title
        url
        duration
        order
      }
    }
  }
`;

// Get chapter by ID
export const CHAPTER_QUERY = gql`
  query($id: UUID!) {
    chapter(id: $id) {
      id
      title
      description
      order
      image_id
      videos {
        id
        title
        url
        duration
        order
      }
    }
  }
`;

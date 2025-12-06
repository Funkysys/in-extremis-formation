import { gql } from "@apollo/client";

// Mutations chapter

export const CREATE_CHAPTER_MUTATION = gql`
  mutation($courseId: UUID!, $title: String!, $description: String, $order: Int, $imageId: UUID, $videoId: UUID) {
    create_chapter(courseId: $courseId, title: $title, description: $description, order: $order, imageId: $imageId, videoId: $videoId) {
      id
      title
      description
      order
      created_at
      updated_at
    }
  }
`;

export const UPDATE_CHAPTER_MUTATION = gql`
  mutation($id: UUID!, $title: String, $description: String, $order: Int, $imageId: UUID) {
    update_chapter(id: $id, title: $title, description: $description, order: $order, imageId: $imageId) {
      id
      title
      description
      order
      created_at
      updated_at
    }
  }
`;

export const DELETE_CHAPTER_MUTATION = gql`
  mutation($id: UUID!) {
    delete_chapter(id: $id) {
      success
      error
    }
  }
`;


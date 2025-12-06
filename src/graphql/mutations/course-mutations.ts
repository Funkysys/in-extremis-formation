// Mutations course

import { gql } from "@apollo/client";

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse(
    $title: String!
    $description: String!
    $price: Float!
  ) {
    createCourse(
      title: $title
      description: $description
      price: $price
    ) {
      course {
        id
        title
        description
        price
      }
      error
    }
  }
`;

export const CREATE_CHAPTER_MUTATION = gql`
  mutation CreateChapter(
    $title: String!
    $description: String
    $order: Int
    $courseId: UUID!
    $videoId: UUID
  ) {
    create_chapter(
      title: $title
      description: $description
      order: $order
      courseId: $courseId
      videoId: $videoId
    ) {
      id
      title
      description
      order
      videoId
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation($id: UUID!, $title: String!, $description: String!, $published: Boolean!) {
    update_course(id: $id, title: $title, description: $description, published: $published) {
      id
      title
      description
      published
      created_at
      updated_at
    }
  }
`;


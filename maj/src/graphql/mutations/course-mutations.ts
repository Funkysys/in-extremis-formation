// Mutations course

import { gql } from "@apollo/client";

export const CREATE_COURSE_MUTATION = gql`
  mutation($title: String!, $description: String!, $published: Boolean!) {
    create_course(title: $title, description: $description, published: $published) {
      id
      title
      description
      cover_image {
        id
        url
        alt_text
        publicId
        width
        height
        format
        created_at
        updated_at
      }
      published
      created_at
      updated_at
      chapters {
        id
        title
        description
        order
        created_at
        updated_at
      }
      videos {
        id
        title
        description
        url
        duration
        order
        thumbnail {
          id
          url
          alt_text
        }
        markers {
          id
          label
          time
          created_at
          updated_at
        }
        created_at
        updated_at
      }
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

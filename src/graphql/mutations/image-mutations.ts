// Mutations image

import { gql } from "@apollo/client";

export const CREATE_IMAGE_MUTATION = gql`
  mutation($file: Upload!, $alt_text: String, $folder: String) {
    create_image(file: $file, alt_text: $alt_text, folder: $folder) {
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
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation($id: UUID!) {
    delete_image(id: $id) {
      success
      error
    }
  }
`;


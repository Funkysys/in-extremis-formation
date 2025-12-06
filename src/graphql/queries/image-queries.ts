// Queries pour la ressource Image

import { gql } from "@apollo/client";

export const IMAGES_QUERY = gql`
  query {
    images {
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

export const IMAGE_QUERY = gql`
  query($id: UUID!) {
    image(id: $id) {
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


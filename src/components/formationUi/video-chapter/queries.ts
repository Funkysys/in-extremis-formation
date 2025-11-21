// GraphQL Queries & Mutations pour les chapitres vidéo

import { gql } from "@apollo/client";

export const GET_VIDEO_MARKERS = gql`
  query GetVideoMarkers($videoId: UUID!) {
    videoMarkers(videoId: $videoId) {
      id
      title
      timestamp
      description
    }
  }
`;

export const CREATE_MARKER = gql`
  mutation CreateVideoMarker($input: CreateVideoMarkerInput!) {
    createVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
      }
      error
    }
  }
`;

export const UPDATE_MARKER = gql`
  mutation UpdateVideoMarker($input: UpdateVideoMarkerInput!) {
    updateVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
      }
      error
    }
  }
`;

export const DELETE_MARKER = gql`
  mutation DeleteVideoMarker($id: UUID!) {
    deleteVideoMarker(id: $id) {
      success
      error
    }
  }
`;

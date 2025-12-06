import { gql } from '@apollo/client';

export const CREATE_VIDEO_MARKER = gql`
  mutation CreateVideoMarker($input: CreateVideoMarkerInput!) {
    createVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
        videoId
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const UPDATE_VIDEO_MARKER = gql`
  mutation UpdateVideoMarker($input: UpdateVideoMarkerInput!) {
    updateVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
        videoId
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const DELETE_VIDEO_MARKER = gql`
  mutation DeleteVideoMarker($id: UUID!) {
    deleteVideoMarker(id: $id) {
      success
      error
    }
  }
`;

export const REORDER_VIDEO_MARKERS = gql`
  mutation ReorderVideoMarkers($input: ReorderVideoMarkersInput!) {
    reorderVideoMarkers(input: $input) {
      success
      error
    }
  }
`;


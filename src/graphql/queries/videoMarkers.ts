import { gql } from '@apollo/client';

export const GET_VIDEO_MARKERS = gql`
  query GetVideoMarkers($videoId: UUID!) {
    videoMarkers(videoId: $videoId) {
      id
      title
      timestamp
      description
      videoId
      createdAt
      updatedAt
    }
  }
`;

export const GET_VIDEO_MARKER = gql`
  query GetVideoMarker($id: UUID!) {
    videoMarker(id: $id) {
      id
      title
      timestamp
      description
      videoId
      createdAt
      updatedAt
    }
  }
`;

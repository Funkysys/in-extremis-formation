// Queries pour la ressource Video (bunny_videos)

import { gql } from "@apollo/client";

export const GET_VIDEOS_QUERY = gql`
  query GetVideos {
    videos {
      id
      title
      url
      description
      duration
      thumbnailUrl
      createdAt
      updatedAt
    }
  }
`;

export const BUNNY_VIDEO_QUERY = gql`
  query($guid: String!) {
    bunny_video(guid: $guid) {
      guid
      title
      date_uploaded
      views
      status
      thumbnail_url
      direct_play_url
      length
    }
  }
`;

// Lister les vidéos d’un chapitre
export const VIDEOS_BY_CHAPTER_QUERY = gql`
  query($chapterId: UUID!) {
    videos(chapterId: $chapterId) {
      id
      title
      url
      duration
      order
      thumbnail_id
      markers {
        id
        title
        timestamp
      }
    }
  }
`;

// Récupérer une vidéo par id
export const VIDEO_QUERY = gql`
  query($id: UUID!) {
    video(id: $id) {
      id
      title
      url
      duration
      order
      thumbnail_id
      markers {
        id
        title
        timestamp
      }
    }
  }
`;

// Récupérer tous les marqueurs d’une vidéo
export const VIDEO_MARKERS_BY_VIDEO_QUERY = gql`
  query($videoId: UUID!) {
    videoMarkers(videoId: $videoId) {
      id
      title
      description
      timestamp
    }
  }
`;

// Récupérer un marqueur vidéo par id
export const VIDEO_MARKER_QUERY = gql`
  query($id: UUID!) {
    videoMarker(id: $id) {
      id
      title
      description
      timestamp
      video_id
    }
  }
`;

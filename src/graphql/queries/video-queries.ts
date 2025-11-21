// Queries pour la ressource Video

import { gql } from "@apollo/client";

// Récupérer une vidéo par ID (avec vérification de permission)
export const VIDEO_BY_ID_QUERY = gql`
  query Video($id: Int!) {
    video(id: $id) {
      id
      title
      url
      description
      duration
      thumbnailUrl
      tags
      is_published
      is_premium
      user_id
      createdAt
      updatedAt
    }
  }
`;

// Liste les vidéos publiques
export const PUBLIC_VIDEOS_QUERY = gql`
  query PublicVideos($limit: Int = 10, $offset: Int = 0) {
    publicVideos(limit: $limit, offset: $offset) {
      id
      title
      url
      description
      duration
      thumbnailUrl
      tags
      is_published
      createdAt
      updatedAt
    }
  }
`;

// Liste les vidéos premium (utilisateur payant uniquement)
export const PREMIUM_VIDEOS_QUERY = gql`
  query PremiumVideos($limit: Int = 10, $offset: Int = 0) {
    premiumVideos(limit: $limit, offset: $offset) {
      id
      title
      url
      description
      duration
      thumbnailUrl
      tags
      is_published
      is_premium
      createdAt
      updatedAt
    }
  }
`;

// Liste les vidéos de l'utilisateur connecté
export const MY_VIDEOS_QUERY = gql`
  query MyVideos($limit: Int = 10, $offset: Int = 0) {
    myVideos(limit: $limit, offset: $offset) {
      id
      title
      url
      description
      duration
      thumbnailUrl
      tags
      is_published
      is_premium
      createdAt
      updatedAt
    }
  }
`;

// Liste toutes les vidéos (admin uniquement)
export const ALL_VIDEOS_QUERY = gql`
  query AllVideos($limit: Int = 10, $offset: Int = 0) {
    allVideos(limit: $limit, offset: $offset) {
      id
      title
      url
      description
      duration
      thumbnailUrl
      tags
      is_published
      is_premium
      user_id
      createdAt
      updatedAt
    }
  }
`;

// Queries existantes pour compatibilité avec Bunny
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
  query BunnyVideo($guid: String!) {
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
  query ($chapterId: UUID!) {
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
  query ($id: UUID!) {
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
  query ($videoId: UUID!) {
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
  query ($id: UUID!) {
    videoMarker(id: $id) {
      id
      title
      description
      timestamp
      video_id
    }
  }
`;

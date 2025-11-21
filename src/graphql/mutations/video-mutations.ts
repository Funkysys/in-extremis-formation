import { gql } from "@apollo/client";

// Créer une vidéo (métadonnées uniquement, upload via REST)
export const CREATE_VIDEO_MUTATION = gql`
  mutation CreateVideo($input: VideoInput!) {
    createVideo(input: $input) {
      video {
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
      error
    }
  }
`;

// Modifier une vidéo
export const UPDATE_VIDEO_MUTATION = gql`
  mutation UpdateVideo($id: Int!, $input: VideoUpdateInput!) {
    updateVideo(id: $id, input: $input) {
      video {
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
      error
    }
  }
`;

// Supprimer une vidéo
export const DELETE_VIDEO_MUTATION = gql`
  mutation DeleteVideo($id: Int!) {
    deleteVideo(id: $id) {
      success
      error
    }
  }
`;

// Modérer une vidéo (admin)
export const MODERATE_VIDEO_MUTATION = gql`
  mutation ModerateVideo($id: Int!, $status: String!) {
    moderateVideo(id: $id, status: $status) {
      video {
        id
        title
        url
        description
        is_published
        createdAt
        updatedAt
      }
      error
    }
  }
`;

// Marquer une vidéo comme premium
export const SET_VIDEO_PREMIUM_MUTATION = gql`
  mutation SetVideoPremium($id: Int!, $is_premium: Boolean!) {
    setVideoPremium(id: $id, is_premium: $is_premium) {
      video {
        id
        title
        is_premium
        createdAt
        updatedAt
      }
      error
    }
  }
`;

// Bunny videos mutations (conservées pour compatibilité)
export const CREATE_BUNNY_VIDEO_MUTATION = gql`
  mutation CreateBunnyVideo($input: CreateBunnyVideoInput!) {
    create_bunny_video(input: $input) {
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

// Get MediaCMS upload token
export const GET_UPLOAD_TOKEN_MUTATION = gql`
  mutation GetMediaCMSUploadToken {
    getMediacmsUploadToken {
      token
      uploadUrl
      userId
      error
    }
  }
`;

// Register uploaded video to MediaCMS
export const REGISTER_UPLOADED_VIDEO_MUTATION = gql`
  mutation RegisterUploadedVideo(
    $mediaCmsId: String!
    $title: String!
    $description: String
    $duration: Float!
    $url: String!
    $thumbnailUrl: String
  ) {
    registerUploadedVideo(
      mediaCmsId: $mediaCmsId
      title: $title
      description: $description
      duration: $duration
      url: $url
      thumbnailUrl: $thumbnailUrl
    ) {
      video {
        id
        title
        url
        description
        duration
        thumbnailUrl
        createdAt
        updatedAt
      }
      error
    }
  }
`;

// Direct video upload mutation
export const UPLOAD_VIDEO_MUTATION = gql`
  mutation UploadVideo($file: Upload!, $title: String!, $description: String) {
    uploadVideo(file: $file, title: $title, description: $description) {
      video {
        id
        title
        url
        description
        duration
        thumbnailUrl
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const DELETE_BUNNY_VIDEO_MUTATION = gql`
  mutation ($guid: String!) {
    delete_bunny_video(guid: $guid) {
      success
      error
    }
  }
`;

export const CREATE_VIDEO_MARKER_MUTATION = gql`
  mutation (
    $videoId: UUID!
    $title: String!
    $description: String
    $timestamp: Float!
  ) {
    createVideoMarker(
      videoId: $videoId
      title: $title
      description: $description
      timestamp: $timestamp
    ) {
      id
      title
      description
      timestamp
      video_id
    }
  }
`;

export const DELETE_VIDEO_MARKER_MUTATION = gql`
  mutation ($id: UUID!) {
    deleteVideoMarker(id: $id) {
      success
      error
    }
  }
`;

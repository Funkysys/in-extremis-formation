import { gql } from "@apollo/client";

// Mutations video (bunny_videos)

export const CREATE_BUNNY_VIDEO_MUTATION = gql`
  mutation($input: CreateBunnyVideoInput!) {
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

export const UPLOAD_VIDEO_MUTATION = gql`
  mutation UploadVideo($file: Upload!, $title: String!) {
    uploadVideo(input: { file: $file, title: $title }) {
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
  mutation($guid: String!) {
    delete_bunny_video(guid: $guid) {
      success
      error
    }
  }
`;

export const CREATE_VIDEO_MARKER_MUTATION = gql`
  mutation($videoId: UUID!, $title: String!, $description: String, $timestamp: Float!) {
    createVideoMarker(videoId: $videoId, title: $title, description: $description, timestamp: $timestamp) {
      id
      title
      description
      timestamp
      video_id
    }
  }
`;

export const DELETE_VIDEO_MARKER_MUTATION = gql`
  mutation($id: UUID!) {
    deleteVideoMarker(id: $id) {
      success
      error
    }
  }
`;

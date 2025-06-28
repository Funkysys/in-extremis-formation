import { gql } from '@apollo/client';

export const UPLOAD_VIDEO_MUTATION = gql`
  mutation UploadVideo($file: Upload!, $title: String!) {
    uploadVideo(file: $file, title: $title) {
      video {
        id
        title
        url
        thumbnailUrl
        duration
        createdAt
        updatedAt
      }
      error
    }
  }
`;

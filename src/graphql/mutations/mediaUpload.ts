import { gql } from '@apollo/client';

export const GET_UPLOAD_TOKEN_MUTATION = gql`
  mutation GetMediacmsUploadToken {
    getMediacmsUploadToken {
      token
      uploadUrl
      userId
      error
    }
  }
`;

export const REGISTER_UPLOADED_VIDEO_MUTATION = gql`
  mutation RegisterUploadedVideo($mediacmsId: String!, $title: String!, $url: String!, $thumbnailUrl: String) {
    registerUploadedVideo(mediacms_id: $mediacmsId, title: $title, url: $url, thumbnail_url: $thumbnailUrl) {
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


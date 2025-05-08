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

export const DELETE_BUNNY_VIDEO_MUTATION = gql`
  mutation($guid: String!) {
    delete_bunny_video(guid: $guid) {
      success
      error
    }
  }
`;

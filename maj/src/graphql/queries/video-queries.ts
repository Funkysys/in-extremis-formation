// Queries pour la ressource Video (bunny_videos)

import { gql } from "@apollo/client";

export const BUNNY_VIDEOS_QUERY = gql`
  query {
    bunny_videos {
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

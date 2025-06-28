import { gql } from "@apollo/client";

export const GENERATE_VIDEO_TOKEN = gql`
  query GenerateVideoToken($videoId: ID!) {
    generateVideoToken(videoId: $videoId) {
      success
      message
      token
    }
  }
`;

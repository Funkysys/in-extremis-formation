import { gql } from "@apollo/client";

export const GET_ACTIVE_LIVES = gql`
  query GetActiveLives {
    activeLiveStreams {
      streamId
      viewerCount
      isActive
      startedAt
      title
      description
      streamerUsername
      streamerId
    }
  }
`;

export const GET_LIVE_BY_ID = gql`
  query GetLiveById($streamId: String!) {
    liveStream(streamId: $streamId) {
      streamId
      viewerCount
      isActive
      startedAt
      title
      description
      streamerUsername
      streamerId
    }
  }
`;

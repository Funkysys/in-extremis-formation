import { gql } from "@apollo/client";

export const GET_ALL_TOPICS = gql`
  query GetAllTopics {
    topics {
      id
      name
      description
      trainers {
        id
        description
        user {
          id
          email
          fullName
        }
      }
      courses {
        id
        title
      }
    }
  }
`;

export const GET_TRAINERS_BY_TOPIC = gql`
  query($topicId: ID!) {
    trainersByTopic(topicId: $topicId) {
      id
      description
      user {
        id
        email
      }
    }
  }
`;

export const GET_TOPICS_BY_TRAINER = gql`
  query($trainerId: ID!) {
    trainer(id: $trainerId) {
      id
      topics {
        id
        name
        description
      }
    }
  }
`;

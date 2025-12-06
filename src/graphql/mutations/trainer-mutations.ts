import { gql } from "@apollo/client";

export const CREATE_TRAINER = gql`
  mutation($userId: ID!, $description: String) {
    createTrainer(userId: $userId, description: $description) {
      id
      description
      user {
        id
        email
      }
    }
  }
`;

export const UPDATE_TRAINER = gql`
  mutation($trainerId: ID!, $description: String) {
    updateTrainer(trainerId: $trainerId, description: $description) {
      id
      description
    }
  }
`;

export const DELETE_TRAINER = gql`
  mutation($trainerId: ID!) {
    deleteTrainer(trainerId: $trainerId)
  }
`;

export const ASSIGN_TOPIC_TO_TRAINER = gql`
  mutation AssignTopicToTrainer($trainerId: ID!, $topicId: ID!) {
    assignTopicToTrainer(trainerId: $trainerId, topicId: $topicId) {
      id
      topics {
        id
        name
      }
    }
  }
`;

export const REMOVE_TOPIC_FROM_TRAINER = gql`
  mutation RemoveTopicFromTrainer($trainerId: ID!, $topicId: ID!) {
    removeTopicFromTrainer(trainerId: $trainerId, topicId: $topicId) {
      id
      topics {
        id
        name
      }
    }
  }
`;

export const SET_TRAINER_TOPICS = gql`
  mutation SetTrainerTopics($trainerId: ID!, $topicIds: [ID!]!) {
    setTrainerTopics(trainerId: $trainerId, topicIds: $topicIds) {
      id
      topics {
        id
        name
      }
    }
  }
`;


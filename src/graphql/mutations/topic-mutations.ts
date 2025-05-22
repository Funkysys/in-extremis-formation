import { gql } from "@apollo/client";

export const CREATE_TOPIC = gql`
  mutation($name: String!, $description: String) {
    createTopic(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const UPDATE_TOPIC = gql`
  mutation($topicId: ID!, $name: String, $description: String) {
    updateTopic(topicId: $topicId, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_TOPIC = gql`
  mutation($topicId: ID!) {
    deleteTopic(topicId: $topicId)
  }
`;

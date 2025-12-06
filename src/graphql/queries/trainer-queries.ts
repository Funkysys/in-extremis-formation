import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query GetUser($id: UUID!) {
    user(id: $id) {
      id
      email
      username
      isActive
      role
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_TRAINERS = gql`
  query GetAllTrainers {
    trainers {
      id
      description
      user {
        id
        email
        username
      }
      topics {
        id
        name
      }
      courses {
        id
        title
      }
    }
  }
`;

export const GET_TRAINER = gql`
  query GetTrainer($id: ID!) {
    trainer(id: $id) {
      id
      description
      user {
        id
        email
        username
      }
      topics {
        id
        name
      }
      courses {
        id
        title
      }
    }
  }
`;

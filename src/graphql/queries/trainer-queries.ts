import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query GetUser($id: UUID!) {
    user(id: $id) {
      id
      email
      fullName
      zipCode
      phone
      address
      city
      country
      isOauth
      isActive
      isSuperuser
      roles {
        name
      }
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        providerAccountId
        accessToken
        refreshToken
        expiresAt
        createdAt
        updatedAt
      }
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
        fullName
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
        fullName
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

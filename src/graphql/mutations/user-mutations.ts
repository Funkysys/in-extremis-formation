// Mutations utilisateur

import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
  mutation($email: String!, $password: String!, $fullName: String!) {
    createUser(email: $email, password: $password, fullName: $fullName) {
      user {
        id
        email
        fullName
        isOauth
        isActive
        isSuperuser
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
      error
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      error
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation($userId: UUID!, $data: UpdateUserInput!) {
    updateUser(userId: $userId, data: $data) {
      user {
        id
        email
        fullName
        isOauth
        isActive
        isSuperuser
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
      success
      error
    }
  }
`;

export const UPDATE_USER_ROLES_MUTATION = gql`
  mutation($userId: UUID!, $roles: [String!]!) {
    updateUserRoles(userId: $userId, roles: $roles) {
      user {
        id
        email
        fullName
        isOauth
        isActive
        isSuperuser
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
      success
      error
    }
  }
`;

export const REQUEST_MAGIC_LINK_MUTATION = gql`
  mutation($email: String!) {
    requestMagicLink(email: $email) {
      success
      error
    }
  }
`;

export const VERIFY_MAGIC_LINK_MUTATION = gql`
  mutation($token: String!) {
    verifyMagicLink(token: $token) {
      token
      error
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation {
    deleteUser {
      success
      error
    }
  }
`;

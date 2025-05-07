
import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query {
    me {
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

export const USERS_QUERY = gql`
  query {
    users {
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

export const USER_QUERY = gql`
  query($id: UUID!) {
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

import { gql } from "@apollo/client";

// Query pour récupérer le profil de l'utilisateur connecté
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
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

// Query pour lister tous les utilisateurs (paginé)
export const USERS_QUERY = gql`
  query Users($limit: Int = 10, $offset: Int = 0) {
    users(limit: $limit, offset: $offset) {
      id
      email
      username
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
      roles {
        name
      }
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

// Query pour récupérer un utilisateur par ID
export const USER_QUERY = gql`
  query User($id: Int!) {
    user(id: $id) {
      id
      email
      username
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
      roles {
        name
      }
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

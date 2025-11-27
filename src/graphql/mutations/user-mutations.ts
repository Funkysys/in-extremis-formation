// Mutations utilisateur

import { gql } from "@apollo/client";

// Connexion utilisateur
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        username
        isOauth
        isActive
        isSuperuser
        roles {
          name
        }
      }
      accessToken
    }
  }
`;

// Inscription nouvel utilisateur
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        username
        isOauth
        isActive
        isSuperuser
      }
      accessToken
    }
  }
`;

// Créer un nouvel utilisateur (admin)
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      user {
        id
        email
        username
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

// Modifier son propre profil
export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UserUpdateInput!) {
    updateMyProfile(input: $input) {
      user {
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
      }
      error
    }
  }
`;

// Modifier un utilisateur (admin)
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      user {
        id
        email
        username
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

// Supprimer son propre compte
export const DELETE_MY_ACCOUNT_MUTATION = gql`
  mutation DeleteMyAccount {
    deleteMyAccount {
      success
      error
    }
  }
`;

// Supprimer un utilisateur (admin)
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: Int!) {
    deleteUser(userId: $userId) {
      success
      error
    }
  }
`;

// Mise à jour des rôles utilisateur (conservé pour compatibilité)
export const UPDATE_USER_ROLES_MUTATION = gql`
  mutation UpdateUserRoles($userId: UUID!, $roles: [String!]!) {
    updateUserRoles(userId: $userId, roles: $roles) {
      user {
        id
        email
        username
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

// Magic Link (conservé pour compatibilité)
export const REQUEST_MAGIC_LINK_MUTATION = gql`
  mutation RequestMagicLink($email: String!) {
    requestMagicLink(email: $email) {
      success
      error
    }
  }
`;

export const VERIFY_MAGIC_LINK_MUTATION = gql`
  mutation VerifyMagicLink($token: String!) {
    verifyMagicLink(token: $token) {
      token
      error
    }
  }
`;

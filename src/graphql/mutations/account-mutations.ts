// Mutations pour les Comptes

import { gql } from "@apollo/client";

// Créer un compte
export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: AccountInput!) {
    createAccount(input: $input) {
      id
      user_id
      account_type
      balance
      currency
      status
      createdAt
      updatedAt
    }
  }
`;

// Mettre à jour un compte
export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation UpdateAccount($id: Int!, $input: AccountUpdateInput!) {
    updateAccount(id: $id, input: $input) {
      id
      user_id
      account_type
      balance
      currency
      status
      createdAt
      updatedAt
    }
  }
`;

// Supprimer un compte
export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount($id: Int!) {
    deleteAccount(id: $id)
  }
`;


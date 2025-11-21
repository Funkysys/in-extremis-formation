// Queries pour les Comptes

import { gql } from "@apollo/client";

// Récupérer un compte par ID
export const GET_ACCOUNT_QUERY = gql`
  query GetAccount($id: Int!) {
    get_account(id: $id) {
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

// Liste tous les comptes
export const LIST_ACCOUNTS_QUERY = gql`
  query ListAccounts {
    list_accounts {
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

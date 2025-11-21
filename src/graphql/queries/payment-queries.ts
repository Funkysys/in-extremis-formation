// Queries pour les Paiements

import { gql } from "@apollo/client";

// Récupérer un paiement par ID
export const GET_PAYMENT_QUERY = gql`
  query GetPayment($id: Int!) {
    get_payment(id: $id) {
      id
      user_id
      amount
      description
      method
      status
      createdAt
      updatedAt
    }
  }
`;

// Liste tous les paiements de l'utilisateur
export const LIST_PAYMENTS_QUERY = gql`
  query ListPayments {
    list_payments {
      id
      user_id
      amount
      description
      method
      status
      createdAt
      updatedAt
    }
  }
`;

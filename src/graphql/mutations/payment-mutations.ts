// Mutations pour les Paiements

import { gql } from "@apollo/client";

// Créer un paiement
export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) {
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

// Mettre à jour un paiement
export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePayment($id: Int!, $input: PaymentUpdateInput!) {
    updatePayment(id: $id, input: $input) {
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

// Supprimer un paiement
export const DELETE_PAYMENT_MUTATION = gql`
  mutation DeletePayment($id: Int!) {
    deletePayment(id: $id)
  }
`;

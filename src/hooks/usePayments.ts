// Hook personnalisé pour la gestion des paiements selon FRONTEND_API_REFERENCE

import {
  CREATE_PAYMENT_MUTATION,
  DELETE_PAYMENT_MUTATION,
  UPDATE_PAYMENT_MUTATION,
} from "@/graphql/mutations";
import { GET_PAYMENT_QUERY, LIST_PAYMENTS_QUERY } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInput {
  amount: number;
  description: string;
  method: string;
}

export interface PaymentUpdateInput {
  amount?: number;
  description?: string;
  method?: string;
  status?: string;
}

/**
 * Hook pour récupérer un paiement par ID
 */
export function usePayment(id: number | null) {
  return useQuery(GET_PAYMENT_QUERY, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Hook pour lister tous les paiements de l'utilisateur
 */
export function usePayments() {
  return useQuery(LIST_PAYMENTS_QUERY);
}

/**
 * Hook pour gérer les mutations de paiement
 */
export function usePaymentMutations() {
  const [createPayment, { loading: creating }] = useMutation(
    CREATE_PAYMENT_MUTATION,
    {
      refetchQueries: [{ query: LIST_PAYMENTS_QUERY }],
    }
  );

  const [updatePayment, { loading: updating }] = useMutation(
    UPDATE_PAYMENT_MUTATION,
    {
      refetchQueries: [{ query: LIST_PAYMENTS_QUERY }],
    }
  );

  const [deletePayment, { loading: deleting }] = useMutation(
    DELETE_PAYMENT_MUTATION,
    {
      refetchQueries: [{ query: LIST_PAYMENTS_QUERY }],
    }
  );

  return {
    createPayment,
    updatePayment,
    deletePayment,
    loading: creating || updating || deleting,
  };
}

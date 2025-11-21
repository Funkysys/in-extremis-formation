// Hook personnalisé pour la gestion des comptes selon FRONTEND_API_REFERENCE

import {
  CREATE_ACCOUNT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  UPDATE_ACCOUNT_MUTATION,
} from "@/graphql/mutations";
import { GET_ACCOUNT_QUERY, LIST_ACCOUNTS_QUERY } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

export interface Account {
  id: string;
  user_id: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountInput {
  account_type: string;
  balance?: number;
  currency?: string;
}

export interface AccountUpdateInput {
  account_type?: string;
  balance?: number;
  currency?: string;
  status?: string;
}

/**
 * Hook pour récupérer un compte par ID
 */
export function useAccount(id: number | null) {
  return useQuery(GET_ACCOUNT_QUERY, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Hook pour lister tous les comptes
 */
export function useAccounts() {
  return useQuery(LIST_ACCOUNTS_QUERY);
}

/**
 * Hook pour gérer les mutations de compte
 */
export function useAccountMutations() {
  const [createAccount, { loading: creating }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    {
      refetchQueries: [{ query: LIST_ACCOUNTS_QUERY }],
    }
  );

  const [updateAccount, { loading: updating }] = useMutation(
    UPDATE_ACCOUNT_MUTATION,
    {
      refetchQueries: [{ query: LIST_ACCOUNTS_QUERY }],
    }
  );

  const [deleteAccount, { loading: deleting }] = useMutation(
    DELETE_ACCOUNT_MUTATION,
    {
      refetchQueries: [{ query: LIST_ACCOUNTS_QUERY }],
    }
  );

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    loading: creating || updating || deleting,
  };
}

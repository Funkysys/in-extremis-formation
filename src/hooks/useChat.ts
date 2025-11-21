// Hook personnalisé pour la gestion du chat selon FRONTEND_API_REFERENCE

import {
  CREATE_CHAT_MUTATION,
  DELETE_CHAT_MUTATION,
  UPDATE_CHAT_MUTATION,
} from "@/graphql/mutations";
import { GET_CHAT_QUERY, LIST_CHATS_QUERY } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

export interface Chat {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatInput {
  room_id: string;
  message: string;
}

export interface ChatUpdateInput {
  message: string;
}

/**
 * Hook pour récupérer un chat par ID
 */
export function useChat(id: number | null) {
  return useQuery(GET_CHAT_QUERY, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Hook pour lister tous les chats
 */
export function useChats() {
  return useQuery(LIST_CHATS_QUERY);
}

/**
 * Hook pour gérer les mutations de chat
 */
export function useChatMutations() {
  const [createChat, { loading: creating }] = useMutation(
    CREATE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: LIST_CHATS_QUERY }],
    }
  );

  const [updateChat, { loading: updating }] = useMutation(
    UPDATE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: LIST_CHATS_QUERY }],
    }
  );

  const [deleteChat, { loading: deleting }] = useMutation(
    DELETE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: LIST_CHATS_QUERY }],
    }
  );

  return {
    createChat,
    updateChat,
    deleteChat,
    loading: creating || updating || deleting,
  };
}

// Mutations pour le Chat

import { gql } from "@apollo/client";

// Créer un message de chat
export const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat($input: ChatInput!) {
    createChat(input: $input) {
      id
      room_id
      user_id
      message
      createdAt
      updatedAt
    }
  }
`;

// Modifier un message
export const UPDATE_CHAT_MUTATION = gql`
  mutation UpdateChat($id: Int!, $input: ChatUpdateInput!) {
    updateChat(id: $id, input: $input) {
      id
      room_id
      user_id
      message
      createdAt
      updatedAt
    }
  }
`;

// Supprimer un message
export const DELETE_CHAT_MUTATION = gql`
  mutation DeleteChat($id: Int!) {
    deleteChat(id: $id)
  }
`;


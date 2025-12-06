// Queries pour le Chat

import { gql } from "@apollo/client";

// Récupérer un chat par ID
export const GET_CHAT_QUERY = gql`
  query GetChat($id: Int!) {
    get_chat(id: $id) {
      id
      room_id
      user_id
      message
      createdAt
      updatedAt
    }
  }
`;

// Liste tous les chats
export const LIST_CHATS_QUERY = gql`
  query ListChats {
    list_chats {
      id
      room_id
      user_id
      message
      createdAt
      updatedAt
    }
  }
`;


import { gql } from "@apollo/client";

export const GET_CART_QUERY = gql`
  query GetCart($userId: UUID!) {
    cartByUser(userId: $userId) {
      id
      userId
      cartItems {
        id
        courseId
        quantity
      }
    }
  }
`;

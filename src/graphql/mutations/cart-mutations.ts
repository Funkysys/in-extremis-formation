import { gql } from "@apollo/client";

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($courseId: UUID!, $quantity: Int) {
    addToCart(courseId: $courseId, quantity: $quantity) {
      id
      items {
        id
        course_id
        quantity
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($cartItemId: UUID!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
      items {
        id
        course_id
        quantity
      }
    }
  }
`;

export const CLEAR_CART_MUTATION = gql`
  mutation ClearCart($cartId: UUID!) {
    clearCart(cartId: $cartId) {
      id
      items {
        id
        course_id
        quantity
      }
    }
  }
`;


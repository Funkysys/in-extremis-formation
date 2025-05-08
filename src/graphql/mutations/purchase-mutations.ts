import { gql } from "@apollo/client";

// Mutations purchase (abonnements)

export const CREATE_SUBSCRIPTION_PLAN_MUTATION = gql`
  mutation($name: String!, $description: String!, $price: Float!, $interval: String!, $features: [String!]!) {
    create_subscription_plan(name: $name, description: $description, price: $price, interval: $interval, features: $features) {
      subscription_plan {
        id
        name
        description
        price
        interval
        features
        created_at
        updated_at
      }
      error
    }
  }
`;

export const UPDATE_SUBSCRIPTION_PLAN_MUTATION = gql`
  mutation($id: UUID!, $name: String, $description: String, $price: Float, $interval: String, $features: [String!]) {
    update_subscription_plan(id: $id, name: $name, description: $description, price: $price, interval: $interval, features: $features) {
      subscription_plan {
        id
        name
        description
        price
        interval
        features
        created_at
        updated_at
      }
      error
    }
  }
`;

export const DELETE_SUBSCRIPTION_PLAN_MUTATION = gql`
  mutation($id: UUID!) {
    delete_subscription_plan(id: $id) {
      success
      error
    }
  }
`;

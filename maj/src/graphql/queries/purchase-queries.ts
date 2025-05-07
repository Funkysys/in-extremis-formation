// Queries pour la ressource Purchase (abonnements)

import { gql } from "@apollo/client";

export const SUBSCRIPTION_PLANS_QUERY = gql`
  query {
    subscription_plans {
      id
      name
      description
      price
      interval
      features
      created_at
      updated_at
    }
  }
`;

export const SUBSCRIPTION_PLAN_QUERY = gql`
  query($id: UUID!) {
    subscription_plan(id: $id) {
      id
      name
      description
      price
      interval
      features
      created_at
      updated_at
    }
  }
`;

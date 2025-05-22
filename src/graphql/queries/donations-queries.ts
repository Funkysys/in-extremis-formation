import { gql } from "@apollo/client";

export const DONATIONS_QUERY = gql`
  query {
    donations {
      id
      amount
      createdAt
      updatedAt
    }
  }
`;

export const DONATION_QUERY = gql`
  query($id: ID!) {
    donation(id: $id) {
      id
      amount
      createdAt
      updatedAt
    }
  }
`;

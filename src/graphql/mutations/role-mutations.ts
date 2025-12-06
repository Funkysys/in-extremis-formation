import { gql } from "@apollo/client";

// Mutations role

export const CREATE_ROLE_MUTATION = gql`
  mutation($name: String!) {
    create_role(name: $name) {
      id
      name
      created_at
      updated_at
    }
  }
`;

export const ASSIGN_ROLE_MUTATION = gql`
  mutation($userId: UUID!, $roleId: UUID!) {
    assign_role(userId: $userId, roleId: $roleId) {
      success
      error
    }
  }
`;

export const REMOVE_ROLE_MUTATION = gql`
  mutation($userId: UUID!, $roleId: UUID!) {
    remove_role(userId: $userId, roleId: $roleId) {
      success
      error
    }
  }
`;


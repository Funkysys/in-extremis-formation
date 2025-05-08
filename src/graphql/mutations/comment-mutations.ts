// Mutations comment

import { gql } from "@apollo/client";

export const CREATE_COMMENT_MUTATION = gql`
  mutation($content: String!, $course_id: String!, $parent_id: String) {
    create_comment(content: $content, course_id: $course_id, parent_id: $parent_id) {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
      user {
        id
        email
        fullName
        isOauth
        isActive
        isSuperuser
        createdAt
        updatedAt
        oauthAccounts {
          id
          provider
          provider_account_id
          access_token
          refresh_token
          expires_at
          created_at
          updated_at
        }
      }
      replies {
        id
        content
        user_id
        course_id
        parent_id
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation($id: String!, $content: String!) {
    update_comment(id: $id, content: $content) {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation($id: String!) {
    delete_comment(id: $id) {
      success
      error
    }
  }
`;

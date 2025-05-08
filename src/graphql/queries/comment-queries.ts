// Queries pour la ressource Comment

import { gql } from "@apollo/client";

export const COURSE_COMMENTS_QUERY = gql`
  query($course_id: String!) {
    course_comments(course_id: $course_id) {
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
  }
`;

export const COMMENT_QUERY = gql`
  query($id: String!) {
    comment(id: $id) {
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

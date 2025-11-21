import { gql } from "@apollo/client";

export const ADD_LIKE_MUTATION = gql`
  mutation AddLike($courseId: ID!) {
    addLike(courseId: $courseId) {
      success
      message
      like {
        id
        userId
        courseId
        createdAt
      }
      course {
        id
        likesCount
        isLikedByUser
      }
    }
  }
`;

export const REMOVE_LIKE_MUTATION = gql`
  mutation RemoveLike($courseId: ID!) {
    removeLike(courseId: $courseId) {
      success
      message
      courseId
      course {
        id
        likesCount
        isLikedByUser
      }
    }
  }
`;

export const TOGGLE_LIKE_MUTATION = gql`
  mutation ToggleLike($courseId: ID!) {
    toggleLike(courseId: $courseId) {
      success
      message
      isLiked
      course {
        id
        likesCount
        isLikedByUser
      }
    }
  }
`;

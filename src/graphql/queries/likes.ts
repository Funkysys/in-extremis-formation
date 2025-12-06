import { gql } from "@apollo/client";

export const GET_USER_LIKES_QUERY = gql`
  query GetUserLikes($limit: Int, $offset: Int) {
    userLikes(limit: $limit, offset: $offset) {
      total
      likes {
        id
        userId
        courseId
        createdAt
        course {
          id
          title
          description
          thumbnail
          duration
          instructor {
            id
            username
            avatar
          }
          likesCount
          isLikedByUser
        }
      }
    }
  }
`;

export const IS_COURSE_LIKED_QUERY = gql`
  query IsCourseLiked($courseId: ID!) {
    isCourseLiked(courseId: $courseId)
  }
`;

export const GET_COURSE_LIKES_COUNT_QUERY = gql`
  query GetCourseLikesCount($courseId: ID!) {
    course(id: $courseId) {
      id
      likesCount
      isLikedByUser
    }
  }
`;


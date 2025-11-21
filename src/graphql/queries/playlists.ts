import { gql } from "@apollo/client";

export const GET_USER_PLAYLISTS_QUERY = gql`
  query GetUserPlaylists($userId: ID!, $page: Int, $limit: Int) {
    userPlaylists(userId: $userId, page: $page, limit: $limit) {
      playlists {
        id
        name
        description
        isPublic
        coursesCount
        thumbnail
        createdAt
        updatedAt
        courses {
          id
          title
          thumbnail
        }
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_PLAYLIST_DETAIL_QUERY = gql`
  query GetPlaylistDetail($id: ID!) {
    playlist(id: $id) {
      id
      name
      description
      isPublic
      coursesCount
      createdAt
      updatedAt
      owner {
        id
        username
        avatar
      }
      courses {
        id
        title
        description
        thumbnail
        duration
        instructor {
          username
          avatar
        }
        position
        isLikedByUser
        likesCount
      }
    }
  }
`;

export const GET_PLAYLIST_COURSES_QUERY = gql`
  query GetPlaylistCourses($playlistId: ID!) {
    playlistCourses(playlistId: $playlistId) {
      id
      title
      thumbnail
      duration
      position
    }
  }
`;

export const CHECK_COURSE_IN_PLAYLISTS_QUERY = gql`
  query CheckCourseInPlaylists($courseId: ID!, $userId: ID!) {
    courseInPlaylists(courseId: $courseId, userId: $userId) {
      playlistId
      playlistName
      isInPlaylist
    }
  }
`;

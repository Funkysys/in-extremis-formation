import { gql } from "@apollo/client";

export const CREATE_PLAYLIST_MUTATION = gql`
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      name
      description
      isPublic
      coursesCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PLAYLIST_MUTATION = gql`
  mutation UpdatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      id
      name
      description
      isPublic
      updatedAt
    }
  }
`;

export const DELETE_PLAYLIST_MUTATION = gql`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id) {
      success
      message
    }
  }
`;

export const ADD_COURSE_TO_PLAYLIST_MUTATION = gql`
  mutation AddCourseToPlaylist($playlistId: ID!, $courseId: ID!) {
    addCourseToPlaylist(playlistId: $playlistId, courseId: $courseId) {
      id
      courses {
        id
        title
        thumbnail
        duration
        position
      }
      coursesCount
    }
  }
`;

export const REMOVE_COURSE_FROM_PLAYLIST_MUTATION = gql`
  mutation RemoveCourseFromPlaylist($playlistId: ID!, $courseId: ID!) {
    removeCourseFromPlaylist(playlistId: $playlistId, courseId: $courseId) {
      id
      courses {
        id
        title
        thumbnail
        position
      }
      coursesCount
    }
  }
`;

export const REORDER_PLAYLIST_COURSES_MUTATION = gql`
  mutation ReorderPlaylistCourses($playlistId: ID!, $courseIds: [ID!]!) {
    reorderPlaylistCourses(playlistId: $playlistId, courseIds: $courseIds) {
      id
      courses {
        id
        position
      }
    }
  }
`;

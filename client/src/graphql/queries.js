import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      username
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      username
      todos {
        id
        title
        completed
      }
    }
  }
`;

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      userId
      user {
        name
        email
      }
    }
  }
`;
import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $completed: Boolean, $userId: ID) {
    createTodo(title: $title, completed: $completed, userId: $userId) {
      id
      title
      completed
      userId
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $username: String!) {
    createUser(name: $name, email: $email, username: $username) {
      id
      name
      email
      username
    }
  }
`;
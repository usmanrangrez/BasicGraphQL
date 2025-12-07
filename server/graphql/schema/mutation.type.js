export default `
  type Mutation {
    createTodo(title: String!, completed: Boolean, userId: ID): Todo
    updateTodo(id: ID!, title: String, completed: Boolean): Todo
    deleteTodo(id: ID!): DeleteResponse
    createUser(name: String!, email: String!, username: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): DeleteResponse

  }
`;

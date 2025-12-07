export default `
  type Query {
    getTodos: [Todo]
    getAllUsers: [User]
    getUserById(id: ID!): User
  }
`;

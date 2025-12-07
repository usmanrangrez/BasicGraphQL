export default `
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
    todos: [Todo]
  }
`;

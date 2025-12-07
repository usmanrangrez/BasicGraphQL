export default `
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    userId: ID!
    user: User
  }
    
 type DeleteResponse {
    success: Boolean!
    message: String
  }
`;

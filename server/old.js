import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import axios from "axios";

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: ` 
      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUserById(id: ID!): User
      }
      
      type Mutation {
        # Todo mutations
        createTodo(title: String!, completed: Boolean, userId: ID): Todo
        updateTodo(id: ID!, title: String, completed: Boolean): Todo
        deleteTodo(id: ID!): DeleteResponse
        
        # User mutations
        createUser(name: String!, email: String!, username: String!): User
        updateUser(id: ID!, name: String, email: String): User
        deleteUser(id: ID!): DeleteResponse
      }
      
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
        todos: [Todo]
      }
      
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
    `,
    
    resolvers: {
      Query: {
        getTodos: async () => {
          try {
            const res = await axios.get(
              "https://jsonplaceholder.typicode.com/todos"
            );
            return res.data;
          } catch (err) {
            console.error(err);
            return [];
          }
        },
        
        getAllUsers: async () => {
          try {
            const res = await axios.get(
              "https://jsonplaceholder.typicode.com/users"
            );
            return res.data;
          } catch (err) {
            console.error(err);
            return [];
          }
        },
        
        getUserById: async (parent, { id }) => {
          try {
            const res = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${id}`
            );
            return res.data;
          } catch (err) {
            console.error(err);
            return null;
          }
        },
      },
      
      Mutation: {
        // CREATE
        createTodo: async (parent, { title, completed, userId }) => {
          try {
            const res = await axios.post(
              "https://jsonplaceholder.typicode.com/todos",
              {
                title,
                completed: completed || false,
                userId: userId || 1
              }
            );
            console.log("✅ Created todo:", res.data);
            return res.data;
          } catch (err) {
            console.error("❌ CREATE TODO ERROR:", err.message);
            throw new Error("Failed to create todo");
          }
        },
        
        createUser: async (parent, { name, email, username }) => {
          try {
            const res = await axios.post(
              "https://jsonplaceholder.typicode.com/users",
              { name, email, username }
            );
            console.log("✅ Created user:", res.data);
            return res.data;
          } catch (err) {
            console.error("❌ CREATE USER ERROR:", err.message);
            throw new Error("Failed to create user");
          }
        },
        
        // UPDATE
        updateTodo: async (parent, { id, title, completed }) => {
          try {
            const updateData = {};
            if (title) updateData.title = title;
            if (completed !== undefined) updateData.completed = completed;
            
            const res = await axios.patch(
              `https://jsonplaceholder.typicode.com/todos/${id}`,
              updateData
            );
            console.log("✅ Updated todo:", res.data);
            return res.data;
          } catch (err) {
            console.error("❌ UPDATE TODO ERROR:", err.message);
            throw new Error("Failed to update todo");
          }
        },
        
        updateUser: async (parent, { id, name, email }) => {
          try {
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            
            const res = await axios.patch(
              `https://jsonplaceholder.typicode.com/users/${id}`,
              updateData
            );
            console.log("✅ Updated user:", res.data);
            return res.data;
          } catch (err) {
            console.error("❌ UPDATE USER ERROR:", err.message);
            throw new Error("Failed to update user");
          }
        },
        
        // DELETE
        deleteTodo: async (parent, { id }) => {
          try {
            await axios.delete(
              `https://jsonplaceholder.typicode.com/todos/${id}`
            );
            console.log(`✅ Deleted todo ${id}`);
            return {
              success: true,
              message: `Todo ${id} deleted successfully`
            };
          } catch (err) {
            console.error("❌ DELETE TODO ERROR:", err.message);
            return {
              success: false,
              message: `Failed to delete todo ${id}`
            };
          }
        },
        
        deleteUser: async (parent, { id }) => {
          try {
            await axios.delete(
              `https://jsonplaceholder.typicode.com/users/${id}`
            );
            console.log(`✅ Deleted user ${id}`);
            return {
              success: true,
              message: `User ${id} deleted successfully`
            };
          } catch (err) {
            console.error("❌ DELETE USER ERROR:", err.message);
            return {
              success: false,
              message: `Failed to delete user ${id}`
            };
          }
        }
      },
      
      User: {
        todos: async (parent) => {
          const userId = parent.id;
          try {
            const res = await axios.get(
              `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
            );
            return res.data;
          } catch (err) {
            console.error("❌ ERROR:", err.message);
            return [];
          }
        },
      },
      
      Todo: {
        user: async (parent) => {
          try {
            const res = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${parent.userId}`
            );
            return res.data;
          } catch (err) {
            console.error("❌ GET USER ERROR:", err.message);
            return null;
          }
        }
      }
    },
  });

  await apolloServer.start();
  app.use(cors());
  app.use(express.json());
  app.use("/graphql", expressMiddleware(apolloServer));
  
  app.listen(8000, () => {
    console.log("🚀 Server is running on http://localhost:8000/graphql");
  });
}

await startServer();
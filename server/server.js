import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

import typeDefs from "./graphql/schema/index.js";
import resolvers from "./graphql/resolvers/index.js";

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors());
app.use(express.json());
app.use("/graphql", expressMiddleware(server));

app.listen(8000, () =>
  console.log("🚀 http://localhost:8000/graphql")
);

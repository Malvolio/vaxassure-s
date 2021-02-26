import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import resolvers, { Context } from "./resolvers";
import typeDefs from "./schema";

export const context = ({ req }: { req: express.Request }): Context => ({
  headers: req.headers,
  ip: req.ip,
});

const server = new ApolloServer({ typeDefs, resolvers, context });

const app = express();
app.use(cors());
server.applyMiddleware({ app, cors: false });

app.listen({ port: 8002 }, () =>
  console.log(`🚀 Server ready at http://localhost:8002${server.graphqlPath}`)
);

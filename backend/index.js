// index.js

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';

dotenv.config();

const startServer = async () => {
  const app = express();
  
  // Connect to the database and get the db object
  const db = await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Set up the middleware
app.use(
  '/graphql',
  cors(),
  // Use the built-in Express JSON parser. It's the modern standard.
  express.json(), 
  expressMiddleware(server, {
    context: async () => ({ db }),
  })
);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer();
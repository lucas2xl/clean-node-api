import { resolvers } from '@/main/graphql/resolvers';
import { typeDefs } from '@/main/graphql/type-defs';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Express } from 'express';

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  app.use('/graphql', expressMiddleware(server));
};

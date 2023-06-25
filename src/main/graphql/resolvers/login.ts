import { ApolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter';
import { makeLoginControllerFactory } from '@/main/factories/controllers/login/login/login-controller-factory';
import { makeSignUpControllerFactory } from '@/main/factories/controllers/login/signup/signup-controller-factory';

export const loginResolver = {
  Query: {
    login: async (_: any, args: any) =>
      ApolloServerResolverAdapter(makeLoginControllerFactory(), args),
  },

  Mutation: {
    login: async (_: any, args: any) =>
      ApolloServerResolverAdapter(makeSignUpControllerFactory(), args),
  },
};

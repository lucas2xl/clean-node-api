import { ApolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter';
import { makeLoadSurveysControllerFactory } from '@/main/factories/controllers/survey/load-surveys-controller-factory';

export const surveyResolver = {
  Query: {
    surveys: async () =>
      ApolloServerResolverAdapter(makeLoadSurveysControllerFactory()),
  },
};

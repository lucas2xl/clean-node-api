import { loginResolver } from '@/main/graphql/resolvers/login';
import { surveyResolver } from '@/main/graphql/resolvers/survey';

export const resolvers = [loginResolver, surveyResolver];

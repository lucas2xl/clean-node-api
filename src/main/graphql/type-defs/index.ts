import { authDirective } from '@/main/graphql/directives/auth';
import { loginDef } from '@/main/graphql/type-defs/login';
import { surveyDef } from '@/main/graphql/type-defs/survey';

const baseDef = `#graphql
type Query {
    _: String
}

type Mutation {
    _: String
}
`;

export const typeDefs = [baseDef, loginDef, surveyDef, authDirective];

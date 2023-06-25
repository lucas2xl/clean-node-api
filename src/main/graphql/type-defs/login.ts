export const loginDef = `#graphql
type Account {
    token: String!
}

extend type Query {
    login(email: String!, password: String!): Account!
}

extend type Mutation {
    login(email: String!, password: String!, name: String!, passwordConfirmation: String!): Account!
}
`;

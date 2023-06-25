export const authDirective = `#graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
    ADMIN
    USER
}
`;

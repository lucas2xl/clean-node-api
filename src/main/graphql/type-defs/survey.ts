export const surveyDef = `#graphql
type SurveyAnswer  {
    image: String
    answer: String!
}

type Survey  {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    createdAt: String!
}

extend type Query @auth(requires: ADMIN) {
    surveys: [Survey!]!
}
`;

export const surveyResultSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    surveyId: { type: 'string' },
    accountId: { type: 'string' },
    answer: { type: 'string' },
    createdAt: { type: 'string' },
  },
};

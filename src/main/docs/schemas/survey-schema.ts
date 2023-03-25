export const surveySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: { image: { type: 'string' }, answer: { type: 'string' } },
      },
    },
    createdAt: { type: 'string' },
  },
};

export const surveyResultBodySchema = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          answer: { type: 'string' },
        },

        required: ['answer'],
      },
    },
  },
};

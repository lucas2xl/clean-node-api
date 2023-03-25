export const surveyBodySchema = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                image: { type: 'string' },
                answer: { type: 'string' },
              },
            },
          },
          createdAt: { type: 'string' },
        },

        required: ['question', 'answers', 'createdAt'],
      },
    },
  },
};

export const unauthorizedComponent = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};

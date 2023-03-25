export const badRequestComponent = {
  description: 'Invalid Request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};

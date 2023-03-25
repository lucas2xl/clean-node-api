export const loginBodySchema = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          passwordConfirmation: { type: 'string' },
        },

        required: ['email', 'password', 'name', 'passwordConfirmation'],
      },
    },
  },
};

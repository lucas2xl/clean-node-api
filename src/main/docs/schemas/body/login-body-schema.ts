export const loginBodySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    passwordConfirmation: { type: 'string' },
  },

  required: ['email', 'password', 'name', 'passwordConfirmation'],
};

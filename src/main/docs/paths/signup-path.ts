export const signupPath = {
  post: {
    tags: ['Login'],
    summary: 'API para criar usuário',
    requestBody: {
      content: {
        'application/json': { schema: { $ref: '#/schemas/login-body' } },
      },
    },
    responses: {
      201: { $ref: '#/components/created' },
      400: { $ref: '#/components/bad-request' },
      404: { $ref: '#/components/not-found' },
      500: { $ref: '#/components/server-error' },
    },
  },
};

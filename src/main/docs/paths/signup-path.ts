export const signupPath = {
  post: {
    tags: ['Login'],
    summary: 'API para criar conta de um usuário',
    requestBody: { $ref: '#/schemas/login-body' },
    responses: {
      201: { $ref: '#/components/signup-response' },
      400: { $ref: '#/components/bad-request' },
      404: { $ref: '#/components/not-found' },
      500: { $ref: '#/components/server-error' },
    },
  },
};

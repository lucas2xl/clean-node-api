export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para authenticar usuário',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login-params',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account',
            },
          },
        },
      },

      400: {
        description: 'Bad Request',
      },
    },
  },
};

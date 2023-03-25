export const surveyPath = {
  get: {
    tags: ['Survey'],
    summary: 'API para listar todas as enquetes',
    security: [{ 'api-key-auth': [] }],
    responses: {
      200: { $ref: '#/components/survey-response' },
      400: { $ref: '#/components/bad-request' },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/not-found' },
      500: { $ref: '#/components/server-error' },
    },
  },

  post: {
    tags: ['Survey'],
    summary: 'API para criar uma enquete',
    security: [{ 'api-key-auth': [] }],
    requestBody: { $ref: '#/schemas/survey-body' },
    responses: {
      204: { $ref: '#/components/no-content' },
      400: { $ref: '#/components/bad-request' },
      403: { $ref: '#/components/forbidden' },
      500: { $ref: '#/components/server-error' },
    },
  },
};

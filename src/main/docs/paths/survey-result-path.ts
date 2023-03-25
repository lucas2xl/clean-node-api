export const surveyResultPath = {
  put: {
    tags: ['Survey'],
    summary: 'API para criar ou atualizar a resposta de uma enquete',
    security: [{ 'api-key-auth': [] }],
    parameters: [{ $ref: '#/schemas/survey-result-params' }],
    requestBody: { $ref: '#/schemas/survey-result-body' },
    responses: {
      200: { $ref: '#/components/survey-result-response' },
      400: { $ref: '#/components/bad-request' },
      403: { $ref: '#/components/forbidden' },
      500: { $ref: '#/components/server-error' },
    },
  },
};

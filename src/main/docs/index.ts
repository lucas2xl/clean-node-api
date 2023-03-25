import { loginPath } from '@/main/docs/paths/login';
import { accountSchema } from '@/main/docs/schemas/account';
import { loginParamsSchema } from '@/main/docs/schemas/login-params';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0.0',
  },

  servers: [
    {
      url: '/api',
    },
  ],

  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Survey',
    },
  ],

  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    'login-params': loginParamsSchema,
  },
};

import { badRequestComponent } from '@/main/docs/components/bad-request-component';
import { createdComponent } from '@/main/docs/components/created-component';
import { notFoundComponent } from '@/main/docs/components/not-found-component';
import { loginResponseComponent } from '@/main/docs/components/responses/login-response-component';
import { serverErrorComponent } from '@/main/docs/components/server-error-component';
import { unauthorizedComponent } from '@/main/docs/components/unauthorized-component';
import { loginPath } from '@/main/docs/paths/login-path';
import { signupPath } from '@/main/docs/paths/signup-path';
import { accountSchema } from '@/main/docs/schemas/account-schema';
import { errorSchema } from '@/main/docs/schemas/error-schema';
import { loginBodySchema } from '@/main/docs/schemas/login-body-schema';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Login' }, { name: 'Survey' }],

  paths: { '/signup': signupPath, '/login': loginPath },

  schemas: {
    account: accountSchema,
    'login-body': loginBodySchema,
    error: errorSchema,
  },

  components: {
    'bad-request': badRequestComponent,
    unauthorized: unauthorizedComponent,
    'server-error': serverErrorComponent,
    'not-found': notFoundComponent,
    'login-response': loginResponseComponent,
    created: createdComponent,
  },
};

import { badRequestComponent } from '@/main/docs/components/bad-request-component';
import { createdComponent } from '@/main/docs/components/created-component';
import { forbiddenComponent } from '@/main/docs/components/forbidden-component';
import { noContentComponent } from '@/main/docs/components/no-content-component';
import { notFoundComponent } from '@/main/docs/components/not-found-component';
import { loginResponseComponent } from '@/main/docs/components/responses/login-response-component';
import { signupResponseComponent } from '@/main/docs/components/responses/signup-response-component';
import { surveyResponseComponent } from '@/main/docs/components/responses/survey-response-component';
import { surveyResultResponseComponent } from '@/main/docs/components/responses/survey-result-response-component';
import { serverErrorComponent } from '@/main/docs/components/server-error-component';
import { unauthorizedComponent } from '@/main/docs/components/unauthorized-component';
import { loginPath } from '@/main/docs/paths/login-path';
import { signupPath } from '@/main/docs/paths/signup-path';
import { surveyPath } from '@/main/docs/paths/survey-path';
import { surveyResultPath } from '@/main/docs/paths/survey-result-path';
import { accountSchema } from '@/main/docs/schemas/account-schema';
import { apiKeyAuthSchema } from '@/main/docs/schemas/api-key-auth-schema';
import { loginBodySchema } from '@/main/docs/schemas/body/login-body-schema';
import { surveyBodySchema } from '@/main/docs/schemas/body/survey-body-schema';
import { surveyResultBodySchema } from '@/main/docs/schemas/body/survey-result-body-schema';
import { errorSchema } from '@/main/docs/schemas/error-schema';
import { surveyResultParamsSchema } from '@/main/docs/schemas/params/survey-result-params-schema';
import { surveyResultSchema } from '@/main/docs/schemas/survey-result-schema';
import { surveySchema } from '@/main/docs/schemas/survey-schema';
import { surveysSchema } from '@/main/docs/schemas/surveys-schema';

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

  paths: {
    '/signup': signupPath,
    '/login': loginPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
  },

  schemas: {
    account: accountSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    'survey-result': surveyResultSchema,

    'login-body': loginBodySchema,
    'survey-body': surveyBodySchema,
    'survey-result-body': surveyResultBodySchema,

    'survey-result-params': surveyResultParamsSchema,

    error: errorSchema,
  },

  components: {
    securitySchemes: { 'api-key-auth': apiKeyAuthSchema },

    'login-response': loginResponseComponent,
    'signup-response': signupResponseComponent,
    'survey-response': surveyResponseComponent,
    'survey-result-response': surveyResultResponseComponent,

    created: createdComponent,
    'no-content': noContentComponent,
    'not-found': notFoundComponent,
    'bad-request': badRequestComponent,
    unauthorized: unauthorizedComponent,
    forbidden: forbiddenComponent,
    'server-error': serverErrorComponent,
  },
};

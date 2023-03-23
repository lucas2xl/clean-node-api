import { ExpressMiddlewareAdapter } from '@/main/adapters/express-middleware-adapter';
import { ExpressRouteAdapter } from '@/main/adapters/express-route-adapter';
import { makeAddSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey-controller-factory';
import { makeAuthMiddlewareFactory } from '@/main/factories/middlewares/auth-middleware-factory';

import { Router } from 'express';

export default function (router: Router): void {
  const adminAuth = ExpressMiddlewareAdapter(
    makeAuthMiddlewareFactory('admin'),
  );
  router.post(
    '/surveys',
    adminAuth,
    ExpressRouteAdapter(makeAddSurveyControllerFactory()),
  );
}

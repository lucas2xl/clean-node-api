import { ExpressRouteAdapter } from '@/main/adapters/express-route-adapter';
import { makeAddSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey-controller-factory';
import { makeLoadSurveysControllerFactory } from '@/main/factories/controllers/survey/load-surveys-controller-factory';
import { adminAuth } from '@/main/middlewares/admin-auth';
import { auth } from '@/main/middlewares/auth';

import { Router } from 'express';

export default function (router: Router): void {
  router.post(
    '/surveys',
    adminAuth,
    ExpressRouteAdapter(makeAddSurveyControllerFactory()),
  );
  router.get(
    '/surveys',
    auth,
    ExpressRouteAdapter(makeLoadSurveysControllerFactory()),
  );
}

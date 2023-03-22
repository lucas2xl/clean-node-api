import { ExpressRouteAdapter } from '@/main/adapters/express/express-route-adapter';
import { makeAddSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey-controller-factory';

import { Router } from 'express';

export default function (router: Router): void {
  router.post(
    '/surveys',
    ExpressRouteAdapter(makeAddSurveyControllerFactory()),
  );
}

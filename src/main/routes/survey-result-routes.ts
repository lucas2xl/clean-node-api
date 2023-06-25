import { ExpressRouteAdapter } from '@/main/adapters/express-route-adapter';
import { makeLoadSurveyResultControllerFactory } from '@/main/factories/controllers/survey-result/load-survey-result-factory';
import { makeSaveSurveyResultControllerFactory } from '@/main/factories/controllers/survey-result/save-survey-result-factory';
import { auth } from '@/main/middlewares/auth';

import { Router } from 'express';

export default function (router: Router): void {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    ExpressRouteAdapter(makeSaveSurveyResultControllerFactory()),
  );
  router.get(
    '/surveys/:surveyId/results',
    auth,
    ExpressRouteAdapter(makeLoadSurveyResultControllerFactory()),
  );
}

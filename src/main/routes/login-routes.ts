import { ExpressRouteAdapter } from '@/main/adapters/express-route-adapter';
import { makeLoginControllerFactory } from '@/main/factories/controllers/login/login/login-controller-factory';
import { makeSignUpControllerFactory } from '@/main/factories/controllers/login/signup/signup-controller-factory';

import { Router } from 'express';

export default function (router: Router): void {
  router.post('/signup', ExpressRouteAdapter(makeSignUpControllerFactory()));
  router.post('/login', ExpressRouteAdapter(makeLoginControllerFactory()));
}

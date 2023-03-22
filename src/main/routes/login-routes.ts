import { ExpressRouteAdapter } from '@/main/adapters/express/express-route-adapter';
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory';
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory';

import { Router } from 'express';

export default function (router: Router): void {
  router.post('/signup', ExpressRouteAdapter(makeSignUpController()));
  router.post('/login', ExpressRouteAdapter(makeLoginController()));
}

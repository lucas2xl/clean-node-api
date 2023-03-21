import { ExpressRouteAdapter } from '@/main/adapters/express/express-route-adapter';
import { makeLoginController } from '@/main/factories/login/login-factory';
import { makeSignUpController } from '@/main/factories/signup/signup-factory';
import { Router } from 'express';

export default function (router: Router): void {
  router.post('/signup', ExpressRouteAdapter(makeSignUpController()));
  router.post('/login', ExpressRouteAdapter(makeLoginController()));
}

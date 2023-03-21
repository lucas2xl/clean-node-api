import { ExpressRouteAdapter } from '@/main/adapters/express/express-route-adapter';
import { makeSignUpController } from '@/main/factories/signup/signup-factory';
import { Router } from 'express';

export default function (router: Router): void {
  router.post('/signup', ExpressRouteAdapter(makeSignUpController()));
}

import { Router } from 'express';
import { ExpressRouteAdapter } from '@/main/adapters/express-route-adapter';
import { makeSignUpController } from '@/main/factories/signup-factory';

export default function (router: Router): void {
  router.post('/signup', ExpressRouteAdapter(makeSignUpController()));
}

import { ExpressMiddlewareAdapter } from '@/main/adapters/express-middleware-adapter';
import { makeAuthMiddlewareFactory } from '@/main/factories/middlewares/auth-middleware-factory';

export const adminAuth = ExpressMiddlewareAdapter(
  makeAuthMiddlewareFactory('admin'),
);

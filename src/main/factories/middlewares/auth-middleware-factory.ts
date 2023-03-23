import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/db-load-account-by-token-factory';
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware';
import { Middleware } from '@/presentation/protocols/middleware';

export function makeAuthMiddlewareFactory(role?: string): Middleware {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
}

import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Middleware } from '@/presentation/protocols/middleware';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByTokenRepository,
    private readonly role: string,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.headers?.['x-access-token'];
      if (!token) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.loadByToken(
        token,
        this.role,
      );

      if (!account) {
        return forbidden(new AccessDeniedError());
      }

      return ok({ accountId: account.id });
    } catch (e) {
      return serverError(e);
    }
  }
}

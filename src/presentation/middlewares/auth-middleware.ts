import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Middleware } from '@/presentation/protocols/middleware';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError());
  }
}

import { Authentication } from '@/domain/usecases/authentication';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

      const token = await this.authentication.auth({ email, password });

      if (!token) {
        return unauthorized();
      }

      return ok({ token });
    } catch (error) {
      return serverError(error);
    }
  }
}

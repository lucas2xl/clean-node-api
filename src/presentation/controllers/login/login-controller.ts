import { Authentication } from '@/domain/usecases/authentication';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import { badRequest, serverError } from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      await this.authentication.auth({ email, password });
    } catch (error) {
      return serverError(error);
    }
  }
}

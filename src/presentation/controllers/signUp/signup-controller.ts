import { AddAccount } from '@/domain/usecases/add-account-usecase';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { MissingParamError } from '@/presentation/errors/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidator } from '@/presentation/protocols/email-validator';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({ email, name, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

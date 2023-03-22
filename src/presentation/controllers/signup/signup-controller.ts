import { AddAccount } from '@/domain/usecases/add-account-usecase';
import { Authentication } from '@/domain/usecases/authentication';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;
      const account = await this.addAccount.add({ email, name, password });

      const token = await this.authentication.auth({ email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

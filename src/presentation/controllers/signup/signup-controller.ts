import { AddAccount } from '@/domain/usecases/add-account-usecase';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/helpers/http-helper';
import { Validation } from '@/presentation/helpers/validators/validation';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = httpRequest.body;
      const account = await this.addAccount.add({ email, name, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}

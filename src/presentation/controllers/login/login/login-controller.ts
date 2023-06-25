import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: AuthenticationUsecase,
    private readonly validation: Validation,
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;

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

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
  export type Response = {
    //
  };
}

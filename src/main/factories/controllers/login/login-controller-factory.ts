import { makeLoginValidation } from '@/main/factories/controllers/login/login-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeLoginController(): Controller {
  const signUpController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );
  return makeLogControllerDecorator(signUpController);
}

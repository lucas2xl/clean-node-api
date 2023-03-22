import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { LoginController } from '@/presentation/controllers/login/login/login-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeLoginControllerFactory(): Controller {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );
  return makeLogControllerDecorator(controller);
}

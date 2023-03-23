import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeSignUpControllerFactory(): Controller {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(controller);
}

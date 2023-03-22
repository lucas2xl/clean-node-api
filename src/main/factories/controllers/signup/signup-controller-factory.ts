import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/add-account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeSignUpController(): Controller {
  const signUpController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication(),
  );
  return makeLogControllerDecorator(signUpController);
}

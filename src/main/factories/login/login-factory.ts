import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import { LogMongoErrorRepository } from '@/infra/database/mongodb/repositories/log/log-mongo-error-repository';
import env from '@/main/config/env';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { makeLoginValidation } from '@/main/factories/login/login-validation-factory';
import { LoginController } from '@/presentation/controllers/login/login-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeLoginController(): Controller {
  const salt = 12;
  const logErrorRepository = new LogMongoErrorRepository();
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
  );
  const signUpController = new LoginController(
    dbAuthentication,
    makeLoginValidation(),
  );
  return new LogControllerDecorator(signUpController, logErrorRepository);
}

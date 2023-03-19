import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository';
import { LogMongoErrorRepository } from '@/infra/database/mongodb/log-mongo-error-repository';
import { LogDecorator } from '@/main/decorators/log-decorator';
import { makeSignUpValidation } from '@/main/factories/signup-validation-factory';
import { SignUpController } from '@/presentation/controllers/signup/signup-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeSignUpController(): Controller {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const logErrorRepository = new LogMongoErrorRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );
  return new LogDecorator(signUpController, logErrorRepository);
}

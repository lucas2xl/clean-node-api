import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository';
import { LogMongoErrorRepository } from '@/infra/database/mongodb/log-mongo-error-repository';
import { LogDecorator } from '@/main/decorators/log-decorator';
import { SignUpController } from '@/presentation/controllers/signUp/signup-controller';
import { Controller } from '@/presentation/protocols/controller';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';

export function makeSignUpController(): Controller {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const logErrorRepository = new LogMongoErrorRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
  );

  return new LogDecorator(signUpController, logErrorRepository);
}

import { SignUpController } from '@/presentation/controllers/signUp/signup-controller';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';
import { Controller } from '@/presentation/protocols/controller';
import { LogDecorator } from '@/main/decorators/log-decorator';

export function makeSignUpController(): Controller {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  return new LogDecorator(
    new SignUpController(emailValidatorAdapter, dbAddAccount),
  );
}

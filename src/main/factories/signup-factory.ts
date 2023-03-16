import { SignUpController } from '@/presentation/controllers/signUp/signup-controller';
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account-usecase';
import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt-adapter';

export function makeSignUpController(): SignUpController {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  return new SignUpController(emailValidatorAdapter, dbAddAccount);
}

import { DbAddAccount } from '@/data/usecases/account/db-add-account';
import { AddAccountUsecase } from '@/domain/usecases/add-account-usecase';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';

export function makeDbAddAccount(): AddAccountUsecase {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
}

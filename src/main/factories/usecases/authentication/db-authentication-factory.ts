import { DbAuthentication } from '@/data/usecases/authentication/db-authentication';
import { Authentication } from '@/domain/usecases/authentication';
import { BcryptAdapter } from '@/infra/criptograph/bcrypt/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import env from '@/main/config/env';

export function makeDbAuthentication(): Authentication {
  const salt = 12;
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
  );
}

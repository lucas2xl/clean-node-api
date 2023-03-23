import { DbLoadAccountByToken } from '@/data/usecases/account/db-load-account-by-token';
import { LoadAccountByTokenUsecase } from '@/domain/usecases/load-account-by-token-usecase';
import { JwtAdapter } from '@/infra/criptograph/jwt/jwt-adapter';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import env from '@/main/config/env';

export function makeDbLoadAccountByToken(): LoadAccountByTokenUsecase {
  const accountMongoRepository = new AccountMongoRepository();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);

  return new DbLoadAccountByToken(accountMongoRepository, jwtAdapter);
}

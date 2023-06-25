import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { LoadAccountByTokenUsecase } from '@/domain/usecases/account/load-account-by-token-usecase';

export class DbLoadAccountByToken implements LoadAccountByTokenRepository {
  constructor(
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private readonly decrypter: Decrypter,
  ) {}

  async loadByToken({
    token,
    role,
  }: LoadAccountByTokenUsecase.Params): Promise<LoadAccountByTokenUsecase.Result> {
    const accessToken = await this.decrypter.decrypt(token);
    if (!accessToken) return null;

    const account = await this.loadAccountByTokenRepository.loadByToken({
      token,
      role,
    });
    if (!account) return null;

    return account;
  }
}

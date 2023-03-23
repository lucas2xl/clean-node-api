import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { AccountModel } from '@/domain/models/account-model';

export class DbLoadAccountByToken implements LoadAccountByTokenRepository {
  constructor(
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
    private readonly decrypter: Decrypter,
  ) {}

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token);

    if (!accessToken) return null;

    const account = await this.loadAccountByTokenRepository.loadByToken(
      token,
      role,
    );

    if (!account) return null;

    return account;
  }
}

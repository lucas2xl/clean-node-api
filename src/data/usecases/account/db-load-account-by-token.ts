import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { AccountModel } from '@/domain/models/account-model';

export class DbLoadAccountByToken implements LoadAccountByTokenRepository {
  constructor(private readonly decrypter: Decrypter) {}

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(token);
    return Promise.resolve(null);
  }
}

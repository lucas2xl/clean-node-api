import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/update-access-token-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email);
    if (!account) return null;

    const isValid = await this.hashCompare.compare(password, account.password);
    if (!isValid) return null;

    const token = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(account.id, token);

    return token;
  }
}

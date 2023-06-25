import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';
import { AuthenticationUsecase } from '@/domain/usecases/authentication/authentication-usecase';

export class DbAuthentication implements DbAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async auth({
    email,
    password,
  }: AuthenticationUsecase.Params): Promise<AuthenticationUsecase.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail({
      email,
    });
    if (!account) return null;

    const isValid = await this.hashCompare.compare(password, account.password);
    if (!isValid) return null;

    const token = await this.encrypter.encrypt(account.id);
    await this.updateAccessTokenRepository.updateAccessToken({
      id: account.id,
      token,
    });

    return token;
  }
}

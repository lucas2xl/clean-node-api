import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { TokenGenerator } from '@/data/protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async auth({ email, password }: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);
    if (account) {
      await this.hashCompare.compare(password, account.password);
      await this.tokenGenerator.generate(account.id);
    }
    return null;
  }
}

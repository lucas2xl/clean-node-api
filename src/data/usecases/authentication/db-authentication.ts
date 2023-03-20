import { LoadAccountByEmailRepository } from '@/data/protocols/database/load-account-by-email-repository';
import {
  Authentication,
  AuthenticationModel,
} from '@/domain/usecases/authentication';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async auth({ email, password }: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(email);
    return null;
  }
}

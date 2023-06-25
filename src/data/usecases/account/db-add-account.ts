import { Hasher } from '@/data/protocols/criptography/hasher';
import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';

export class DbAddAccount implements AddAccountUsecase {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(
    accountData: AddAccountUsecase.Params,
  ): Promise<AddAccountUsecase.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail({
      email: accountData.email,
    });
    if (account) return null;

    const hashedPassword = await this.hasher.hash(accountData.password);

    return this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
  }
}

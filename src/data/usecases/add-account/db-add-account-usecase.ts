import { Hasher } from '@/data/protocols/criptography/hasher';
import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { AccountModel } from '@/domain/models/account-model';
import {
  AddAccount,
  AddAccountModel,
} from '@/domain/usecases/add-account-usecase';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    return this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
  }
}

import { Encrypter } from '@/data/protocols/encrypter';
import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AccountModel } from '@/domain/models/account-model';
import {
  AddAccount,
  AddAccountModel,
} from '@/domain/usecases/add-account-usecase';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return Promise.resolve(undefined);
  }
}

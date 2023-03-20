import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { AddAccountRepository } from '@/data/protocols/database/add-account-repository';
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
    return this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
  }
}

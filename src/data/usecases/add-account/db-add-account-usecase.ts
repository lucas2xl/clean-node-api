import { Encrypter } from '@/data/protocols/encrypter';
import { AccountModel } from '@/domain/models/account-model';
import {
  AddAccount,
  AddAccountModel,
} from '@/domain/usecases/add-account-usecase';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return Promise.resolve(undefined);
  }
}

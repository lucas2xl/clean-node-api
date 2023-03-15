import { AddAccount, AddAccountModel } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { Encrypter } from '@/data/protocols/encrypter';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return Promise.resolve(undefined);
  }
}

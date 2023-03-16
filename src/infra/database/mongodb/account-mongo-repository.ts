import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AccountModel } from '@/domain/models/account-model';
import { Db } from 'mongodb';

export class AccountMongoRepository implements AddAccountRepository {
  constructor(private readonly database: Db) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = this.database.collection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return {
      id: account._id,
      name: account.name,
      email: account.email,
      password: account.password,
    };
  }
}

import { AddAccountRepository } from '@/data/protocols/database/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/load-account-by-email-repository';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return account && MongoHelper.instance.map<AccountModel>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );

    const account = await accountCollection.findOne({ email });
    console.log(account);

    return account && MongoHelper.instance.map<AccountModel>(account);
  }
}

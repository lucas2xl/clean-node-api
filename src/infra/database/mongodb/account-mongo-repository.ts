import { AddAccountRepository } from '@/data/protocols/add-account-repository';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AccountModel } from '@/domain/models/account-model';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.database.collection('accounts');

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return MongoHelper.map<AccountModel>(account);
  }
}

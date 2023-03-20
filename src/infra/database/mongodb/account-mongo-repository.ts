import { AddAccountRepository } from '@/data/protocols/database/add-account-repository';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return MongoHelper.instance.map<AccountModel>(account);
  }
}

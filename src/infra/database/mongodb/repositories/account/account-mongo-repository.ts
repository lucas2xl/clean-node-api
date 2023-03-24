import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  private readonly collectionName = 'accounts';

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return account && MongoHelper.instance.map<AccountModel>(account);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.instance.map<AccountModel>(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          token: token,
        },
      },
    );
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    const account = await accountCollection.findOne({
      token,
      $or: [{ role }, { role: 'admin' }],
    });
    return account && MongoHelper.instance.map<AccountModel>(account);
  }
}

import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/database/account/update-access-token-repository';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';
import { LoadAccountByTokenUsecase } from '@/domain/usecases/account/load-account-by-token-usecase';

import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  private readonly collectionName = 'accounts';

  async add(
    accountData: AddAccountUsecase.Params,
  ): Promise<AddAccountUsecase.Result> {
    const accountCollection = await this.getCollection();

    const { insertedId } = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: insertedId });

    return MongoHelper.instance.map<AccountModel>(account);
  }

  async loadByEmail({
    email,
  }: LoadAccountByEmailRepository.Params): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await this.getCollection();

    const account = await accountCollection.findOne({ email });
    return MongoHelper.instance.map<AccountModel>(account);
  }

  async updateAccessToken({
    id,
    token,
  }: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
    const accountCollection = await this.getCollection();

    await accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          token: token,
        },
      },
    );
  }

  async loadByToken({
    token,
    role,
  }: LoadAccountByTokenUsecase.Params): Promise<LoadAccountByTokenUsecase.Result> {
    const accountCollection = await this.getCollection();

    const account = await accountCollection.findOne({
      token,
      $or: [{ role }, { role: 'admin' }],
    });
    return MongoHelper.instance.map<AccountModel>(account);
  }

  private async getCollection(): Promise<Collection> {
    return MongoHelper.instance.getCollection(this.collectionName);
  }
}

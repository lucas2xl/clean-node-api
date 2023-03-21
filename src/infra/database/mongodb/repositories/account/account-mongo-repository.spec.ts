import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import * as process from 'process';

function makeAddAccountModel(): AddAccountModel {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}

function makeSut(): AccountMongoRepository {
  return new AccountMongoRepository();
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );
    await accountCollection.deleteMany({});
  });

  it('should return an account add on success', async () => {
    const sut = makeSut();
    const account = await sut.add(makeAddAccountModel());

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any-email');
    expect(account.password).toBe('any-password');
  });

  it('should return an account loadByEmail on success', async () => {
    const sut = makeSut();
    await sut.add(makeAddAccountModel());
    const account = await sut.loadByEmail('any-email');

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('any-name');
    expect(account.email).toBe('any-email');
    expect(account.password).toBe('any-password');
  });

  it('should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();
    const res = await sut.add(makeAddAccountModel());
    expect(res.token).toBeFalsy();

    await sut.updateAccessToken(res.id, 'any-token');
    const account = await sut.loadByEmail(res.email);

    expect(account.token).toBeTruthy();
  });

  it('should return null if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any-email');

    expect(account).toBeFalsy();
  });
});

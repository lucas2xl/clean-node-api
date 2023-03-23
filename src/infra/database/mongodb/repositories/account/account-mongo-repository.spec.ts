import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import env from '@/main/config/env';
import { Collection } from 'mongodb';

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
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.instance.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('add()', () => {
    it('should return an account add on success', async () => {
      const sut = makeSut();
      const account = await sut.add(makeAddAccountModel());

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.name).toBe('any-name');
      expect(account.email).toBe('any-email');
      expect(account.password).toBe('any-password');
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await sut.add(makeAddAccountModel());
      const account = await sut.loadByEmail('any-email');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.name).toBe('any-name');
      expect(account.email).toBe('any-email');
      expect(account.password).toBe('any-password');
    });

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any-email');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    it('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const res = await sut.add(makeAddAccountModel());
      expect(res.token).toBeFalsy();

      await sut.updateAccessToken(res.id, 'any-token');
      const account = await sut.loadByEmail(res.email);

      expect(account.token).toBeTruthy();
    });
  });

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...makeAddAccountModel(),
        token: 'any-token',
      });
      const account = await sut.loadByToken('any-token');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.token).toBe('any-token');
    });

    it('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...makeAddAccountModel(),
        token: 'any-token',
        role: 'admin',
      });
      const account = await sut.loadByToken('any-token', 'admin');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.token).toBe('any-token');
      expect(account.role).toBe('admin');
    });

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...makeAddAccountModel(),
        token: 'any-token',
      });
      const account = await sut.loadByToken('any-token', 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken with user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        ...makeAddAccountModel(),
        token: 'any-token',
        role: 'admin',
      });
      const account = await sut.loadByToken('any-token');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.token).toBe('any-token');
    });

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any-token');

      expect(account).toBeFalsy();
    });
  });
});

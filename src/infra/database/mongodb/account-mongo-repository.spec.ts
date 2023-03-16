import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository';
import { Db, MongoClient } from 'mongodb';
import * as process from 'process';

let connection: MongoClient;
let db: Db;

function makeSut(): AccountMongoRepository {
  return new AccountMongoRepository(db);
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL);
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    const accountCollection = db.collection('account');
    await accountCollection.deleteMany({});
  });

  it('should return an account on success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });
});

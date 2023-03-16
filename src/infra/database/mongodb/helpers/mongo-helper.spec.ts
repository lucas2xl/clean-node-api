import { MongoHelper as sut } from '@/infra/database/mongodb/helpers/mongo-helper';
import * as process from 'process';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');

    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});

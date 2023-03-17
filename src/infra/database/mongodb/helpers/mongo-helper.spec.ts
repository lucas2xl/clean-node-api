import { MongoHelper as sut } from '@/infra/database/mongodb/helpers/mongo-helper';
import * as process from 'process';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.instance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.instance.disconnect();
  });

  it('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.instance.getCollection('accounts');

    expect(accountCollection).toBeTruthy();
    await sut.instance.disconnect();
    accountCollection = await sut.instance.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});

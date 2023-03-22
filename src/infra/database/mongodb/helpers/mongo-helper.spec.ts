import { MongoHelper as sut } from '@/infra/database/mongodb/helpers/mongo-helper';
import env from '@/main/config/env';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.instance.connect(env.mongoUrl);
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

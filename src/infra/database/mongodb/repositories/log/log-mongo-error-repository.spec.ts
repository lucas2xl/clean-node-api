import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { LogMongoErrorRepository } from '@/infra/database/mongodb/repositories/log/log-mongo-error-repository';
import env from '@/main/config/env';
import { Collection } from 'mongodb';

function makeSut(): LogErrorRepository {
  return new LogMongoErrorRepository();
}

describe('Log Mongo Error Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.instance.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  it('should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any-error');
    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});

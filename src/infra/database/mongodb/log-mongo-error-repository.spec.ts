import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { LogMongoErrorRepository } from '@/infra/database/mongodb/log-mongo-error-repository';
import { Collection } from 'mongodb';
import * as process from 'process';

function makeSut(): LogErrorRepository {
  return new LogMongoErrorRepository();
}

describe('Log Mongo Error Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL);
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

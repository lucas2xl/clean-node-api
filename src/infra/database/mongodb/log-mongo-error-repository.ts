import { LogErrorRepository } from '@/data/protocols/log-error-repository';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class LogMongoErrorRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.insertOne({
      stack,
      created_at: new Date(),
    });
  }
}

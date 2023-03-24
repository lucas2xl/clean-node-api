import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class LogMongoErrorRepository implements LogErrorRepository {
  private readonly collectionName = 'errors';

  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );
    await errorCollection.insertOne({
      stack,
      created_at: new Date(),
    });
  }
}

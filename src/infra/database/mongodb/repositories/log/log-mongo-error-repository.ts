import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

export class LogMongoErrorRepository implements LogErrorRepository {
  private readonly collectionName = 'errors';

  async logError(stack: string): Promise<void> {
    const errorCollection = await this.getCollection();

    await errorCollection.insertOne({
      stack,
      created_at: new Date(),
    });
  }

  private async getCollection(): Promise<Collection> {
    return MongoHelper.instance.getCollection(this.collectionName);
  }
}

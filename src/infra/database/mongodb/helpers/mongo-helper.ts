import { Collection, Db, MongoClient } from 'mongodb';

export class MongoHelper {
  private connection: MongoClient = null;
  private database: Db = null;
  private url: string = null;

  private constructor() {}

  private static _instance: MongoHelper;

  static get instance(): MongoHelper {
    if (!MongoHelper._instance) {
      MongoHelper._instance = new MongoHelper();
    }
    return MongoHelper._instance;
  }

  async connect(url: string): Promise<void> {
    this.connection = await MongoClient.connect(url);
    this.database = await this.connection.db();
    this.url = url;
  }

  async disconnect(): Promise<void> {
    await this.connection.close();
    this.connection = null;
    this.database = null;
  }

  async getCollection(name: string): Promise<Collection> {
    if (!this.connection) {
      await this.connect(this.url);
    }
    return this.database.collection(name);
  }

  map<T>(collection: { [key: string]: any }): T {
    const { _id, ...collectionWithOutId } = collection;
    return { ...collectionWithOutId, id: _id } as T;
  }

  arrayMap<T>(collections: { [key: string]: any }[]): T {
    return collections.map(collection => {
      const { _id, ...collectionWithOutId } = collection;
      return { ...collectionWithOutId, id: _id } as T;
    }) as T;
  }
}

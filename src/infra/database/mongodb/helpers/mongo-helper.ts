import { Collection, Db, MongoClient } from 'mongodb';
import * as process from 'process';

export const MongoHelper = {
  connection: null as MongoClient,
  database: null as Db,

  async connect(): Promise<void> {
    this.connection = await MongoClient.connect(process.env.MONGO_URL);
    this.database = await this.connection.db();
  },

  async disconnect(): Promise<void> {
    await this.connection.close();
  },

  async getCollection(name: string): Promise<Collection> {
    return this.database.collection(name);
  },

  map<T>(collection: { [key: string]: any }): T {
    const { _id, ...collectionWithOutId } = collection;
    return { ...collectionWithOutId, id: _id } as T;
  },
};

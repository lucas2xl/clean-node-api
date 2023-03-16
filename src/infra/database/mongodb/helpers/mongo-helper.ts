import { Collection, Db, MongoClient } from 'mongodb';

export const MongoHelper = {
  connection: null as MongoClient,
  database: null as Db,

  async connect(url: string): Promise<void> {
    this.connection = await MongoClient.connect(url);
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

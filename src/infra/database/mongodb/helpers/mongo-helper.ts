import { Collection, Db, MongoClient } from 'mongodb';

export const MongoHelper = {
  connection: null as MongoClient,
  database: null as Db,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.connection = await MongoClient.connect(url);
    this.database = await this.connection.db();
    this.url = url;
  },

  async disconnect(): Promise<void> {
    await this.connection.close();
    this.connection = null;
    this.database = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.connection?.isConnected) {
      await this.connect(this.url);
    }
    return this.database.collection(name);
  },

  map<T>(collection: { [key: string]: any }): T {
    const { _id, ...collectionWithOutId } = collection;
    return { ...collectionWithOutId, id: _id } as T;
  },
};

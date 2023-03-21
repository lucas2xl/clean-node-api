import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import * as process from 'process';
import * as request from 'supertest';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any-name',
          email: 'any-email@mail.com',
          password: 'any-password',
          passwordConfirmation: 'any-password',
        })

        .expect(200);
    });
  });
});

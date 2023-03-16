import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import * as request from 'supertest';
import * as process from 'process';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('account');
    await accountCollection.deleteMany({});
  });

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        passwordConfirmation: 'any-password',
      })
      .expect(200);
  });
});

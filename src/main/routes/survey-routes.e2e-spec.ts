import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import env from '@/main/config/env';
import * as request from 'supertest';

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    const surveyCollection = await MongoHelper.instance.getCollection(
      'surveys',
    );
    await surveyCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    it('Should return 403 on add survey without token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any-question',
          answers: [{ image: 'any-image', answer: 'any-answer' }],
        })
        .expect(403);
    });
  });
});

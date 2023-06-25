import { mockAddAccountParams } from '@/domain/mock/mock-account';
import { mockAddSurveyParams } from '@/domain/mock/mock-survey';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

type MongoTypes = {
  accountMongo: AccountMongoRepository;
  surveyMongo: SurveyMongoRepository;
};

async function makeToken(id: string): Promise<string> {
  return sign({ id }, env.jwtSecret);
}

function makeMongoRepository(): MongoTypes {
  const accountMongo = new AccountMongoRepository();
  const surveyMongo = new SurveyMongoRepository();

  return { accountMongo, surveyMongo };
}

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
    const accountCollection = await MongoHelper.instance.getCollection(
      'accounts',
    );

    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result without token', async () => {
      await request(app)
        .put('/api/surveys/any-id/results')
        .send({ answer: 'any-answer' })
        .expect(403);
    });

    it('Should return 200 on save survey result with token', async () => {
      const { surveyMongo, accountMongo } = makeMongoRepository();
      await surveyMongo.add(mockAddSurveyParams());
      const surveys = await surveyMongo.loadAll();
      const account = await accountMongo.add(mockAddAccountParams());
      const fakeToken = await makeToken(account.id);
      await accountMongo.updateAccessToken({
        id: account.id,
        token: fakeToken,
      });

      await request(app)
        .put(`/api/surveys/${surveys[0].id}/results`)
        .send({ answer: 'any-answer' })
        .set('x-access-token', fakeToken)
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result without token', async () => {
      await request(app).get('/api/surveys/any-id/results').expect(403);
    });

    it('Should return 200 on save survey result with token', async () => {
      const { surveyMongo, accountMongo } = makeMongoRepository();
      await surveyMongo.add(mockAddSurveyParams());
      const surveys = await surveyMongo.loadAll();
      const account = await accountMongo.add(mockAddAccountParams());
      const fakeToken = await makeToken(account.id);
      await accountMongo.updateAccessToken({
        id: account.id,
        token: fakeToken,
      });

      await request(app)
        .get(`/api/surveys/${surveys[0].id}/results`)
        .set('x-access-token', fakeToken)
        .expect(200);
    });
  });
});

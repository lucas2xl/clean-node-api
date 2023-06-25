import {
  mockAccountModel,
  mockAddAccountWithTokenAndRoleParams,
} from '@/domain/mock/mock-account';
import { mockAddSurveyParams } from '@/domain/mock/mock-survey';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { mockToken } from '@/main/mock/mock-token';
import * as request from 'supertest';

type MongoTypes = {
  accountMongo: AccountMongoRepository;
  surveyMongo: SurveyMongoRepository;
};

function mockMongoRepository(): MongoTypes {
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

    it('Should return 201 on add survey with valid token', async () => {
      const { accountMongo } = mockMongoRepository();
      const account = await accountMongo.add(
        mockAddAccountWithTokenAndRoleParams(),
      );
      const fakeToken = await mockToken(account.id);
      await accountMongo.updateAccessToken({
        id: account.id,
        token: fakeToken,
      });

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', fakeToken)
        .send({
          question: 'any-question',
          answers: [{ image: 'any-image', answer: 'any-answer' }],
        })
        .expect(201);
    });
  });

  describe('GET /surveys', () => {
    it('Should return 403 on load survey without token', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    it('Should return 200 on load surveys with valid token', async () => {
      const { accountMongo, surveyMongo } = mockMongoRepository();
      await surveyMongo.add(mockAddSurveyParams());
      const account = await accountMongo.add(mockAccountModel());
      const fakeToken = await mockToken(account.id);
      await accountMongo.updateAccessToken({
        id: account.id,
        token: fakeToken,
      });

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', fakeToken)
        .expect(200);
    });
  });
});

import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import * as request from 'supertest';

async function makeAddAccountModel(): Promise<AddAccountModel> {
  return {
    name: 'any-name',
    email: 'any-email@mail.com',
    password: 'any-password',
  };
}

function makeAddSurveyModel(): AddSurveyModel {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

async function makeToken(id: string): Promise<string> {
  return sign({ id }, env.jwtSecret);
}

function makeAccountMongoRepository(): AccountMongoRepository {
  return new AccountMongoRepository();
}

function makeSurveyMongoRepository(): SurveyMongoRepository {
  return new SurveyMongoRepository();
}

describe('Survey Routes', () => {
  let surveyCollection: Collection;
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys');
    accountCollection = await MongoHelper.instance.getCollection('accounts');

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
      const accountMongoRepository = makeAccountMongoRepository();
      const fakeAccount = await makeAddAccountModel();
      const account = await accountMongoRepository.add(fakeAccount);
      const fakeToken = await makeToken(account.id);
      await accountCollection.updateOne(
        {
          _id: account.id,
        },
        { $set: { token: fakeToken, role: 'admin' } },
      );

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
      const accountMongoRepository = makeAccountMongoRepository();
      const surveyMongoRepository = makeSurveyMongoRepository();
      await surveyMongoRepository.add(makeAddSurveyModel());
      const fakeAccount = await makeAddAccountModel();
      const account = await accountMongoRepository.add(fakeAccount);
      const fakeToken = await makeToken(account.id);
      await accountCollection.updateOne(
        {
          _id: account.id,
        },
        { $set: { token: fakeToken } },
      );

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', fakeToken)
        .expect(200);
    });
  });
});

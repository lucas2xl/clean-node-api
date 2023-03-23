import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { AccountMongoRepository } from '@/infra/database/mongodb/repositories/account/account-mongo-repository';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

interface MongoTypes {
  accountMongo: AccountMongoRepository;
  surveyMongo: SurveyMongoRepository;
}

function makeAddAccount(): AddAccountModel {
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
      const { accountMongo } = makeMongoRepository();
      const account = await accountMongo.add({
        ...makeAddAccount(),
        role: 'admin',
      });
      const fakeToken = await makeToken(account.id);
      await accountMongo.updateAccessToken(account.id, fakeToken);

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
      const { accountMongo, surveyMongo } = makeMongoRepository();
      await surveyMongo.add(makeAddSurveyModel());
      const account = await accountMongo.add({ ...makeAddAccount() });
      const fakeToken = await makeToken(account.id);
      await accountMongo.updateAccessToken(account.id, fakeToken);

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', fakeToken)
        .expect(200);
    });
  });
});

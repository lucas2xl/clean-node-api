import { AddAccountModel } from '@/domain/usecases/add-account-usecase';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-result-mongo-repository';
import env from '@/main/config/env';
import * as mockdate from 'mockdate';
import { Collection } from 'mongodb';

let surveyCollection: Collection;
let accountCollection: Collection;

function makeAddSurveyData(): AddSurveyModel {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

function makeAddAccountData(): AddAccountModel {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
  };
}

async function insertSurvey(): Promise<string> {
  const { insertedId } = await surveyCollection.insertOne({
    ...makeAddSurveyData(),
  });

  return insertedId.toJSON();
}

async function insertAccount(): Promise<string> {
  const { insertedId } = await accountCollection.insertOne({
    ...makeAddAccountData(),
  });

  return insertedId.toJSON();
}

function makeSut(): SurveyResultMongoRepository {
  return new SurveyResultMongoRepository();
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    mockdate.set(new Date());
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

  describe('save()', () => {
    it('should add a survey if its new', async () => {
      const sut = makeSut();
      const surveyId = await insertSurvey();
      const accountId = await insertAccount();

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'any-answer',
        createdAt: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe('any-answer');
    });
  });
});

import { mockAddAccountParams } from '@/domain/mock/mock-account';
import { mockAddSurveyParams } from '@/domain/mock/mock-survey';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/repositories/survey-result/survey-result-mongo-repository';
import env from '@/main/config/env';
import * as mockdate from 'mockdate';
import { Collection } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

async function mockSurvey(): Promise<string> {
  const { insertedId } = await surveyCollection.insertOne(
    mockAddSurveyParams(),
  );

  return insertedId.toJSON();
}

async function mockSurveyResult(
  saveSurveyResult: SaveSurveyResultUsecase.Params,
): Promise<string> {
  const { insertedId } = await surveyResultCollection.insertOne(
    saveSurveyResult,
  );

  return insertedId as unknown as string;
}

async function mockAccount(): Promise<string> {
  const { insertedId } = await accountCollection.insertOne(
    mockAddAccountParams(),
  );

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
    surveyResultCollection = await MongoHelper.instance.getCollection(
      'surveyResults',
    );
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
  });

  describe('save()', () => {
    it('should add a survey result if it`s new', async () => {
      const sut = makeSut();
      const surveyId = await mockSurvey();
      const accountId = await mockAccount();

      await sut.save({
        surveyId,
        accountId,
        answer: 'any-answer',
        createdAt: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId,
        accountId,
      });

      expect(surveyResult).toBeTruthy();
    });

    it('should update survey result if it`s not new', async () => {
      const sut = makeSut();

      const surveyId = await mockSurvey();
      const accountId = await mockAccount();
      await mockSurveyResult({
        surveyId,
        accountId,
        answer: 'any-answer',
        createdAt: new Date(),
      });

      await sut.save({
        surveyId,
        accountId,
        answer: 'any-answer-updated',
        createdAt: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          surveyId,
          accountId,
        })
        .toArray();

      expect(surveyResult.length).toBe(1);
    });
  });

  describe.skip('LoadBySurveyId()', () => {
    it('should load survey result', async () => {
      const sut = makeSut();

      const surveyId = await mockSurvey();
      const accountId = await mockAccount();
      await mockSurveyResult({
        surveyId,
        accountId,
        answer: 'any-answer',
        createdAt: new Date(),
      });

      const surveyResult = await sut.loadBySurveyId({ surveyId, accountId });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(surveyId);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(100);
    });
  });
});

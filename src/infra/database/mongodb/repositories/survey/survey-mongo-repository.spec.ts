import { mockAddSurveyParams } from '@/domain/mock/mock-survey';
import { SurveyModel } from '@/domain/models/survey-model';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';
import env from '@/main/config/env';
import * as mockdate from 'mockdate';
import { Collection } from 'mongodb';

function makeSut(): SurveyMongoRepository {
  return new SurveyMongoRepository();
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection;

  beforeAll(async () => {
    mockdate.set(new Date());
    await MongoHelper.instance.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.instance.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const survey = MongoHelper.instance.map<SurveyModel>(
        await surveyCollection.findOne({ question: 'any-question' }),
      );

      expect(survey).toBeTruthy();
      expect(survey).toHaveProperty('id');
      expect(survey).toHaveProperty('question');
      expect(survey).toHaveProperty('answers');
    });
  });

  describe('loadAll()', () => {
    it('should loadAll a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(1);
      expect(surveys[0].question).toBe('any-question');
    });

    it('should loadAll empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load by id a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const surveys = await sut.loadAll();
      const survey = await sut.loadById({ id: surveys[0].id });

      expect(survey).toBeTruthy();
    });
  });
});

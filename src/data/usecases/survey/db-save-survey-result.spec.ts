import { SaveSurveyResultRepository } from '@/data/protocols/database/survey/save-survey-result-repository';
import { DbSaveSurveyResult } from '@/data/usecases/survey/db-save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultUsecase } from '@/domain/usecases/save-survey-result-usecase';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: SaveSurveyResultUsecase;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

function makeFakeSurveyResultData(): Omit<SurveyResultModel, 'id'> {
  return {
    accountId: 'any-accountId',
    surveyId: 'any-surveyId',
    answer: 'any-answer',
    createdAt: new Date(),
  };
}

function makeFakeSurveyResult(): SurveyResultModel {
  return { ...makeFakeSurveyResultData(), id: 'any-id' };
}

function makeSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
}

function makeSut(): SutTypes {
  const saveSurveyResultRepositoryStub = makeSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);
  return { sut, saveSurveyResultRepositoryStub };
}

describe('DbSaveSurvey Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = makeFakeSurveyResultData();
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValue(new Error());
    const promise = sut.save(makeFakeSurveyResultData());

    await expect(promise).rejects.toThrow();
  });
});

import {
  mockLoadSurveyResultRepository,
  mockSaveSurveyResultRepository,
} from '@/data/mock/mock-db-survey-result';
import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/db-save-survey-result';
import {
  mockSaveSurveyResultParams,
  mockSurveyResultModel,
} from '@/domain/mock/mock-survey-result';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: SaveSurveyResultUsecase;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

function makeSut(): SutTypes {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
}

describe('DbSaveSurvey Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  it('should call LoadSurveyRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    const surveyResultData = mockSaveSurveyResultParams();
    await sut.save(surveyResultData);

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith({
      surveyId: surveyResultData.surveyId,
      accountId: surveyResultData.accountId,
    });
  });

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValue(new Error());
    const promise = sut.save(mockSaveSurveyResultParams());

    await expect(promise).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});

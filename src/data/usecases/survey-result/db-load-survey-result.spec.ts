import { mockLoadSurveyByIdRepository } from '@/data/mock/mock-db-account';
import { mockLoadSurveyResultRepository } from '@/data/mock/mock-db-survey-result';
import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/db-load-survey-result';
import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: LoadSurveyResultUsecase;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

function makeSut(): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  );
  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub };
}

describe('DbLoadSurvey Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId',
    );
    await sut.load({ surveyId: 'any-survey-id', accountId: 'any-account-id' });

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith({
      surveyId: 'any-survey-id',
      accountId: 'any-account-id',
    });
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub,
    } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(null);

    await sut.load({ surveyId: 'any-survey-id', accountId: 'any-account-id' });

    expect(loadByIdSpy).toHaveBeenCalledWith({ id: 'any-survey-id' });
  });

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValue(new Error());
    const promise = sut.load({
      surveyId: 'any-survey-id',
      accountId: 'any-account-id',
    });

    await expect(promise).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load({
      surveyId: 'any-survey-id',
      accountId: 'any-account-id',
    });

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });

  it('should return SurveyResult with all answers with count 0 if LoadSurveyRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(null);
    const surveyResult = await sut.load({
      surveyId: 'any-survey-id',
      accountId: 'any-account-id',
    });

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});

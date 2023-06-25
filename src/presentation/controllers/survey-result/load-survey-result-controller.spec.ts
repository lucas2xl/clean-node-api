import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveyByIdUsecase } from '@/presentation/mock/mock-survey';
import { mockLoadSurveyResultUsecase } from '@/presentation/mock/mock-survey-result';
import { Controller } from '@/presentation/protocols/controller';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: Controller;
  loadSurveyByIdStub: LoadSurveyByIdUsecase;
  loadSurveyResultStub: LoadSurveyResultUsecase;
};

function mockRequest(): LoadSurveyResultController.Request {
  return {
    surveyId: 'any-survey-id',
    accountId: 'any-account-id',
  };
}

function makeSut(): SutTypes {
  const loadSurveyByIdStub = mockLoadSurveyByIdUsecase();
  const loadSurveyResultStub = mockLoadSurveyResultUsecase();
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub,
  );
  return { sut, loadSurveyByIdStub, loadSurveyResultStub };
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith({ id: 'any-survey-id' });
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById returns throw', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(loadSurveyResultStub, 'load');
    const request = mockRequest();
    await sut.handle(request);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: request.surveyId,
      accountId: request.accountId,
    });
  });

  it('should return 500 if LoadSurveyResult returns throw', async () => {
    const { sut, loadSurveyResultStub } = makeSut();
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});

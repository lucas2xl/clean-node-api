import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveyByIdUsecase } from '@/presentation/mock/mock-survey';
import { mockSaveSurveyResultUsecase } from '@/presentation/mock/mock-survey-result';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';
import { mockValidation } from '@/validations/mock/mock-validation';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: Controller;
  validationStub: Validation;
  saveSurveyResultStub: SaveSurveyResultUsecase;
  loadSurveyByIdStub: LoadSurveyByIdUsecase;
};

function mockRequest(): HttpRequest {
  return {
    params: {
      surveyId: 'any-survey-id',
    },
    body: {
      answer: 'any-answer',
    },
    accountId: 'any-account-id',
  };
}

function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const saveSurveyResultStub = mockSaveSurveyResultUsecase();
  const loadSurveyByIdStub = mockLoadSurveyByIdUsecase();
  const sut = new SaveSurveyResultController(
    validationStub,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );
  return { sut, validationStub, saveSurveyResultStub, loadSurveyByIdStub };
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith({
      ...httpRequest.params,
      ...httpRequest.body,
      accountId: httpRequest?.accountId,
    });
  });

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(mockRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any-survey-id');
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

  it('should return 403 if an invalid answer is provider', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    httpRequest.body.answer = 'wrong-answer';
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(saveSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params,
      accountId: httpRequest.accountId,
      createdAt: new Date(),
    });
  });

  it('should return 500 if SaveSurveyResult returns throw', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});

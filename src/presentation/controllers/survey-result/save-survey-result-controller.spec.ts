import { SurveyModel } from '@/domain/models/survey-model';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import {
  forbidden,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: Controller;
  validationStub: Validation;
  saveSurveyResultStub: SaveSurveyResultUsecase;
  loadSurveyByIdStub: LoadSurveyByIdUsecase;
};

function makeFakeSurvey(): SurveyModel {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

function makeFakeSurveyResult(): SurveyResultModel {
  return {
    id: 'valid-id',
    accountId: 'valid-account-id',
    surveyId: 'valid-survey-id',
    answer: 'valid-answer',
    createdAt: new Date(),
  };
}

function makeFakeRequest(): HttpRequest {
  return {
    params: {
      surveyId: 'any-survey-id',
    },
    body: {
      answer: 'any-answer',
      createdAt: new Date(),
    },
    accountId: 'any-account-id',
  };
}

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error {
      return null;
    }
  }

  return new ValidationStub();
}

function makeSaveSurveyResult(): SaveSurveyResultUsecase {
  class SaveSurveyResultStub implements SaveSurveyResultUsecase {
    async save(): Promise<SurveyResultModel> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultStub();
}

function makeLoadSurveyById(): LoadSurveyByIdUsecase {
  class LoadSurveyByIdStub implements LoadSurveyByIdUsecase {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
}

function makeSut(): SutTypes {
  const validationStub = makeValidation();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const loadSurveyByIdStub = makeLoadSurveyById();
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
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith({
      ...httpRequest.params,
      ...httpRequest.body,
    });
  });

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(makeFakeRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any-survey-id');
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById returns throw', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 403 if an invalid answer is provider', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    httpRequest.body.answer = 'wrong-answer';
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  it('should call Validation with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(saveSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params,
      accountId: httpRequest.accountId,
    });
  });
});

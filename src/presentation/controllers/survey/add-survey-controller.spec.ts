import { AddSurveyUsecase } from '@/domain/usecases/add-survey-usecase';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import {
  badRequest,
  created,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';
import * as mockdate from 'mockdate';

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurveyUsecase;
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      question: 'any-question',
      answers: [{ image: 'any-image', answer: 'any-answer' }],
      createdAt: new Date(),
    },
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

function makeAddSurvey(): AddSurveyUsecase {
  class AddSurveyStub implements AddSurveyUsecase {
    add(): Promise<void> {
      return Promise.resolve(undefined);
    }
  }

  return new AddSurveyStub();
}

function makeSut(): SutTypes {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return { sut, validationStub, addSurveyStub };
}

describe('AddSurvey Controller', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(created());
  });
});

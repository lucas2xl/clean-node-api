import { AddSurvey } from '@/domain/usecases/add-survey-usecase';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import { badRequest } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      question: 'any-question',
      answers: [{ image: 'any-image', answer: 'any-answer' }],
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

function makeAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
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
});

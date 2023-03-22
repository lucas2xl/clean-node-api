import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

interface SutTypes {
  sut: Controller;
  validationStub: Validation;
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

function makeSut(): SutTypes {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return { sut, validationStub };
}

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});

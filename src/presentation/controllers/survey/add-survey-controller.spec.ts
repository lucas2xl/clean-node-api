import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import {
  badRequest,
  created,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { mockAddSurveyUsecase } from '@/presentation/mock/mock-survey';
import { Controller } from '@/presentation/protocols/controller';
import { Validation } from '@/presentation/protocols/validation';
import { mockValidation } from '@/validations/mock/mock-validation';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurveyUsecase;
};

function mockRequest(): AddSurveyController.Request {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
  };
}

function makeSut(): SutTypes {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurveyUsecase();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return { sut, validationStub, addSurveyStub };
}

describe('AddSurvey Controller', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const request = mockRequest();
    await sut.handle(request);

    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const request = mockRequest();
    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({ ...request, createdAt: new Date() });
  });

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(created());
  });
});

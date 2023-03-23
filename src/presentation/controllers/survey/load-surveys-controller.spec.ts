import { SurveyModel } from '@/domain/models/survey-model';
import { LoadSurveysUsecase } from '@/domain/usecases/load-surveys-usecase';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys-controller';
import {
  noContent,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: Controller;
  loadSurveyStub: LoadSurveysUsecase;
};

function makeFakeSurveys(): SurveyModel[] {
  return [
    {
      id: 'any-id',
      question: 'any-question',
      answers: [{ image: 'any-image', answer: 'any-answer' }],
      createdAt: new Date(),
    },
  ];
}

function makeLoadSurvey(): LoadSurveysUsecase {
  class LoadSurveyStub implements LoadSurveysUsecase {
    async load(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  return new LoadSurveyStub();
}

function makeSut(): SutTypes {
  const loadSurveyStub = makeLoadSurvey();
  const sut = new LoadSurveysController(loadSurveyStub);
  return { sut, loadSurveyStub };
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockdate.set(new Date());
  });

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveyStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyStub, 'load');
    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(makeFakeSurveys()));
  });

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveyStub } = makeSut();
    jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveyStub } = makeSut();
    jest.spyOn(loadSurveyStub, 'load').mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});

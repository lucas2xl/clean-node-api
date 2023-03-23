import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { DbLoadSurveys } from '@/data/usecases/survey/db-load-surveys';
import { SurveyModel } from '@/domain/models/survey-model';
import { LoadSurveysUsecase } from '@/domain/usecases/load-surveys-usecase';
import mockdate from 'mockdate';

interface SutTypes {
  sut: LoadSurveysUsecase;
  loadSurveysRepositoryStub: LoadSurveysRepository;
}

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

function makeLoadSurveysRepository(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return makeFakeSurveys();
    }
  }

  return new LoadSurveysRepositoryStub();
}

function makeSut(): SutTypes {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
  return { sut, loadSurveysRepositoryStub };
}

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();

    expect(loadSpy).toHaveBeenCalled();
  });

  it('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const surveys = await sut.load();

    expect(surveys).toEqual(makeFakeSurveys());
  });

  it('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockRejectedValue(new Error());
    const promise = sut.load();

    await expect(promise).rejects.toThrow();
  });
});

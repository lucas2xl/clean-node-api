import { mockLoadSurveysRepository } from '@/data/mock/mock-db-survey';
import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { DbLoadSurveys } from '@/data/usecases/survey/db-load-surveys';
import { mockSurveyModels } from '@/domain/mock/mock-survey';
import { LoadSurveysUsecase } from '@/domain/usecases/survey/load-surveys-usecase';
import mockdate from 'mockdate';

type SutTypes = {
  sut: LoadSurveysUsecase;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

function makeSut(): SutTypes {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository();
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

    expect(surveys).toEqual(mockSurveyModels());
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

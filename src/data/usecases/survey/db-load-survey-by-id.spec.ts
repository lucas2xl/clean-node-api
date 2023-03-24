import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { DbLoadSurveyById } from '@/data/usecases/survey/db-load-survey-by-id';
import { SurveyModel } from '@/domain/models/survey-model';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import mockdate from 'mockdate';

type SutTypes = {
  sut: LoadSurveyByIdUsecase;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

function makeFakeSurvey(): SurveyModel {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

function makeLoadSurveyByIdRepository(): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdRepositoryStub();
}

function makeSut(): SutTypes {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
  return { sut, loadSurveyByIdRepositoryStub };
}

describe('DbLoadSurveyById Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any-id');

    expect(loadByIdSpy).toHaveBeenCalledWith('any-id');
  });

  it('should return survey on success', async () => {
    const { sut } = makeSut();
    const survey = await sut.loadById('any-id');

    expect(survey).toEqual(makeFakeSurvey());
  });

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockRejectedValue(new Error());
    const promise = sut.loadById('any-id');

    await expect(promise).rejects.toThrow();
  });
});

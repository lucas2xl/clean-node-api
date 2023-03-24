import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { DbAddSurvey } from '@/data/usecases/survey/db-add-survey';
import {
  AddSurveyModel,
  AddSurveyUsecase,
} from '@/domain/usecases/survey/add-survey-usecase';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: AddSurveyUsecase;
  addSurveyRepositoryStub: AddSurveyRepository;
};

function makeFakeSurveyData(): AddSurveyModel {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

function makeAddSurveyRepository(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return Promise.resolve(undefined);
    }
  }

  return new AddSurveyRepositoryStub();
}

function makeSut(): SutTypes {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValue(new Error());
    const promise = sut.add(makeFakeSurveyData());

    await expect(promise).rejects.toThrow();
  });
});

import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { DbAddSurvey } from '@/data/usecases/survey/db-add-survey';
import {
  AddSurveyModel,
  AddSurveyUsecase,
} from '@/domain/usecases/add-survey-usecase';

interface SutTypes {
  sut: AddSurveyUsecase;
  addSurveyRepositoryStub: AddSurveyRepository;
}

function makeFakeSurveyData(): AddSurveyModel {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
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
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});

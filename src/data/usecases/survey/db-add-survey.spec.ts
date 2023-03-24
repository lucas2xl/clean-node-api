import { mockAddSurveyRepository } from '@/data/mock/mock-db-survey';
import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { DbAddSurvey } from '@/data/usecases/survey/db-add-survey';
import { mockAddSurveyParams } from '@/domain/mock/mock-survey';
import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';
import * as mockdate from 'mockdate';

type SutTypes = {
  sut: AddSurveyUsecase;
  addSurveyRepositoryStub: AddSurveyRepository;
};

function makeSut(): SutTypes {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub };
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => mockdate.set(new Date()));

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);

    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  it('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValue(new Error());
    const promise = sut.add(mockAddSurveyParams());

    await expect(promise).rejects.toThrow();
  });
});

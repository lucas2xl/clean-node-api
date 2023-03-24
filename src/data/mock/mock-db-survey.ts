import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { mockSurveyModels } from '@/domain/mock/mock-survey';
import { SurveyModel } from '@/domain/models/survey-model';

export function mockAddSurveyRepository(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return null;
    }
  }

  return new AddSurveyRepositoryStub();
}

export function mockLoadSurveysRepository(): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return mockSurveyModels();
    }
  }

  return new LoadSurveysRepositoryStub();
}

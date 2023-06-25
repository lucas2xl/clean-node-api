import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result-model';

export function mockSaveSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<void> {
      return;
    }
  }

  return new SaveSurveyResultRepositoryStub();
}

export function mockLoadSurveyResultRepository(): LoadSurveyResultRepository {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultRepositoryStub();
}

import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result-model';

export function mockSaveSurveyResultRepository(): SaveSurveyResultRepository {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultRepositoryStub();
}

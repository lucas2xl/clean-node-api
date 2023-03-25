import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export function mockSaveSurveyResultUsecase(): SaveSurveyResultUsecase {
  class SaveSurveyResultStub implements SaveSurveyResultUsecase {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
}

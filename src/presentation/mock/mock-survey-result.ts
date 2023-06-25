import { mockSurveyResultModel } from '@/domain/mock/mock-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export function mockSaveSurveyResultUsecase(): SaveSurveyResultUsecase {
  class SaveSurveyResultStub implements SaveSurveyResultUsecase {
    async save(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
}

export function mockLoadSurveyResultUsecase(): LoadSurveyResultUsecase {
  class LoadSurveyResultStub implements LoadSurveyResultUsecase {
    async load(): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultStub();
}

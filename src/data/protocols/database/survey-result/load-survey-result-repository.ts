import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';

export interface LoadSurveyResultRepository {
  loadBySurveyId(
    data: LoadSurveyResultRepository.Params,
  ): Promise<LoadSurveyResultRepository.Result>;
}

export namespace LoadSurveyResultRepository {
  export type Params = LoadSurveyResultUsecase.Params;
  export type Result = SurveyResultModel;
}

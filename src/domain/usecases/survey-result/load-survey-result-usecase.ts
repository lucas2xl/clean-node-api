import { SurveyResultModel } from '@/domain/models/survey-result-model';

export interface LoadSurveyResultUsecase {
  load(
    data: LoadSurveyResultUsecase.Params,
  ): Promise<LoadSurveyResultUsecase.Result>;
}

export namespace LoadSurveyResultUsecase {
  export type Params = {
    surveyId: string;
    accountId: string;
  };

  export type Result = SurveyResultModel;
}

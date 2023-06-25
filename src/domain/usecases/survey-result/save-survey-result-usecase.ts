import { SurveyResultModel } from '@/domain/models/survey-result-model';

export interface SaveSurveyResultUsecase {
  save(
    data: SaveSurveyResultUsecase.Params,
  ): Promise<SaveSurveyResultUsecase.Result>;
}

export namespace SaveSurveyResultUsecase {
  export type Params = {
    surveyId: string;
    accountId: string;
    answer: string;
    createdAt: Date;
  };

  export type Result = SurveyResultModel;
}

import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveyByIdUsecase {
  loadById(
    data: LoadSurveyByIdUsecase.Params,
  ): Promise<LoadSurveyByIdUsecase.Result>;
}

export namespace LoadSurveyByIdUsecase {
  export type Params = {
    id: string;
  };

  export type Result = SurveyModel;
}

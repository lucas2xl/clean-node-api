import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveysUsecase {
  load(): Promise<LoadSurveysUsecase.Result>;
}

export namespace LoadSurveysUsecase {
  export type Result = SurveyModel[];
}

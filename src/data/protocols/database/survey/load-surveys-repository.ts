import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveysRepository {
  loadAll(): Promise<LoadSurveysRepository.Result>;
}

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[];
}

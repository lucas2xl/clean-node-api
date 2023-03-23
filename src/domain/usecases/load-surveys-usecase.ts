import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveysUsecase {
  load(): Promise<SurveyModel[]>;
}

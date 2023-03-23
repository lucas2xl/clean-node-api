import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveysRepository {
  loadAll(): Promise<SurveyModel[]>;
}

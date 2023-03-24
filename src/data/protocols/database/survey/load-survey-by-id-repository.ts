import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<SurveyModel>;
}

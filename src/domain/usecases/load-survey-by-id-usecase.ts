import { SurveyModel } from '@/domain/models/survey-model';

export interface LoadSurveyByIdUsecase {
  loadById(id: string): Promise<SurveyModel>;
}

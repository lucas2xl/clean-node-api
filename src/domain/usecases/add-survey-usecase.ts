import { SurveyModel } from '@/domain/models/survey-model';

export type AddSurveyModel = Omit<SurveyModel, 'id'>;

export interface AddSurveyUsecase {
  add(surveyData: AddSurveyModel): Promise<void>;
}

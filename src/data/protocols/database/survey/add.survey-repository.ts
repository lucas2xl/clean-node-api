import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';

export interface AddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}

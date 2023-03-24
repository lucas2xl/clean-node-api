import { AddSurveyModel } from '@/domain/usecases/survey/add-survey-usecase';

export interface AddSurveyRepository {
  add(surveyData: AddSurveyModel): Promise<void>;
}

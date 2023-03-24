import { AddSurveyParams } from '@/domain/usecases/survey/add-survey-usecase';

export interface AddSurveyRepository {
  add(surveyData: AddSurveyParams): Promise<void>;
}

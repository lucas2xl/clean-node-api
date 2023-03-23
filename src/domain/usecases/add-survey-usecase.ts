import { SurveyAnswer } from '@/domain/models/survey-model';

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswer[];
  createdAt: Date;
}

export interface AddSurveyUsecase {
  add(surveyData: AddSurveyModel): Promise<void>;
}

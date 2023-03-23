import { SurveyAnswer } from '@/domain/models/survey-model';

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswer[];
  createdAt: Date;
};

export interface AddSurveyUsecase {
  add(surveyData: AddSurveyModel): Promise<void>;
}

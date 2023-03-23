interface SurveyAnswers {
  image?: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswers[];
  createdAt: Date;
}

export interface AddSurveyUsecase {
  add(surveyData: AddSurveyModel): Promise<void>;
}

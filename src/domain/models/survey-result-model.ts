type SurveyResultAnswer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
};

export type SurveyResultModel = {
  surveyId: string;
  question: string;
  answers: SurveyResultAnswer[];
  createdAt: Date;
};

import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export function mockSaveSurveyResultParams(): SaveSurveyResultUsecase.Params {
  return {
    accountId: 'any-account-id',
    surveyId: 'any-survey-id',
    answer: 'any-answer',
    createdAt: new Date(),
  };
}

export function mockSurveyResultModel(): SurveyResultModel {
  return {
    surveyId: 'any-survey-id',
    question: 'any-question',
    answers: [
      {
        image: 'any-image',
        answer: 'any-answer',
        count: 0,
        percent: 0,
      },
    ],
    createdAt: new Date(),
  };
}

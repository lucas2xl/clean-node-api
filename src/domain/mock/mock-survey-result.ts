import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export function mockSaveSurveyResultParams(): SaveSurveyResultParams {
  return {
    accountId: 'any-account-id',
    surveyId: 'any-survey-id',
    answer: 'any-answer',
    createdAt: new Date(),
  };
}

export function mockSurveyResultModel(): SurveyResultModel {
  return {
    id: 'any-id',
    accountId: 'any-account-id',
    surveyId: 'any-survey-id',
    answer: 'any-answer',
    createdAt: new Date(),
  };
}

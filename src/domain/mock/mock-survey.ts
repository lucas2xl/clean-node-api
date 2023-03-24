import { SurveyModel } from '@/domain/models/survey-model';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey-usecase';

export function mockAddSurveyParams(): AddSurveyParams {
  return {
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

export function mockSurveyModels(): SurveyModel[] {
  return [
    {
      id: 'any-id',
      question: 'any-question',
      answers: [{ image: 'any-image', answer: 'any-answer' }],
      createdAt: new Date(),
    },
  ];
}

export function mockSurveyModel(): SurveyModel {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [{ image: 'any-image', answer: 'any-answer' }],
    createdAt: new Date(),
  };
}

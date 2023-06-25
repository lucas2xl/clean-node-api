import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';

export interface AddSurveyRepository {
  add(
    surveyData: AddSurveyRepository.Params,
  ): Promise<AddSurveyRepository.Result>;
}

export namespace AddSurveyRepository {
  export type Params = AddSurveyUsecase.Params;
  export type Result = void;
}

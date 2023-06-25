import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export interface SaveSurveyResultRepository {
  save(
    data: SaveSurveyResultRepository.Params,
  ): Promise<SaveSurveyResultRepository.Result>;
}

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResultUsecase.Params;
  export type Result = void;
}

import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';

export interface LoadSurveyByIdRepository {
  loadById(
    id: LoadSurveyByIdUsecase.Params,
  ): Promise<LoadSurveyByIdUsecase.Result>;
}

export namespace LoadSurveyByIdRepository {
  export type Params = LoadSurveyByIdUsecase.Params;
  export type Result = void;
}

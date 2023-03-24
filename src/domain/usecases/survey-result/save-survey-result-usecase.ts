import { SurveyResultModel } from '@/domain/models/survey-result-model';

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResultUsecase {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}

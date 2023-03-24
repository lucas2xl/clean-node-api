import { SurveyResultModel } from '@/domain/models/survey-result-model';

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResultUsecase {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}

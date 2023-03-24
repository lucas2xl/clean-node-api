import { SurveyResultModel } from '@/domain/models/survey-result-model';

type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>;

export interface SaveSurveyResultUsecase {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}

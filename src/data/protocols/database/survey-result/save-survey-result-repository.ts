import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}

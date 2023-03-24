import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultModel): Promise<SurveyResultModel>;
}

import { SaveSurveyResultRepository } from '@/data/protocols/database/survey/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import {
  SaveSurveyResultModel,
  SaveSurveyResultUsecase,
} from '@/domain/usecases/save-survey-result-usecase';

export class DbSaveSurveyResult implements SaveSurveyResultUsecase {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return this.saveSurveyResultRepository.save(data);
  }
}

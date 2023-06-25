import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';

export class DbSaveSurveyResult implements SaveSurveyResultUsecase {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(
    data: SaveSurveyResultUsecase.Params,
  ): Promise<SaveSurveyResultUsecase.Result> {
    await this.saveSurveyResultRepository.save(data);
    return this.loadSurveyResultRepository.loadBySurveyId({
      surveyId: data.surveyId,
      accountId: data.accountId,
    });
  }
}

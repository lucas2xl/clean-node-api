import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey-model';
import { LoadSurveysUsecase } from '@/domain/usecases/load-surveys-usecase';

export class DbLoadSurveys implements LoadSurveysUsecase {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll();
    return [];
  }
}

import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/models/survey-model';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/load-survey-by-id-usecase';

export class DbLoadSurveyById implements LoadSurveyByIdUsecase {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id);
    return null;
  }
}

import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';

export class DbLoadSurveyById implements LoadSurveyByIdUsecase {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(
    id: LoadSurveyByIdUsecase.Params,
  ): Promise<LoadSurveyByIdUsecase.Result> {
    return this.loadSurveyByIdRepository.loadById(id);
  }
}

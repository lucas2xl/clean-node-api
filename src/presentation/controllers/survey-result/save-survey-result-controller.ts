import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly saveSurveyResult: SaveSurveyResultUsecase,
    private readonly loadSurveyById: LoadSurveyByIdUsecase,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return Promise.resolve(undefined);
  }
}

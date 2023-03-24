import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import { forbidden } from '@/presentation/helpers/http/http-helper';
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
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId,
    );
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }

    return Promise.resolve(undefined);
  }
}

import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyByIdUsecase,
    private readonly saveSurveyResult: SaveSurveyResultUsecase,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const data = { ...httpRequest.params, ...httpRequest.body };
      const error = this.validation.validate(data);
      if (error) {
        return badRequest(error);
      }

      const { surveyId } = httpRequest.params;
      const { answer } = httpRequest.body;
      const { accountId } = httpRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(item => item.answer);
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        createdAt: new Date(),
      });
      return ok(surveyResult);
    } catch (e) {
      return serverError(e);
    }
  }
}

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
import { HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly loadSurveyById: LoadSurveyByIdUsecase,
    private readonly saveSurveyResult: SaveSurveyResultUsecase,
  ) {}

  async handle(
    request: SaveSurveyResultController.Request,
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { accountId, surveyId, answer } = request;

      const survey = await this.loadSurveyById.loadById({ id: surveyId });
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

export namespace SaveSurveyResultController {
  export type Request = {
    accountId: string;
    surveyId: string;
    answer: string;
  };
}

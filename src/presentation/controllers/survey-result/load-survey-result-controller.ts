import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { InvalidParamError } from '@/presentation/errors/invalid-param-error';
import {
  forbidden,
  ok,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse } from '@/presentation/protocols/http';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyByIdUsecase,
    private readonly loadSurveyResult: LoadSurveyResultUsecase,
  ) {}

  async handle(
    request: LoadSurveyResultController.Request,
  ): Promise<HttpResponse> {
    try {
      const { accountId, surveyId } = request;
      const survey = await this.loadSurveyById.loadById({ id: surveyId });
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load({
        surveyId,
        accountId,
      });
      return ok(surveyResult);
    } catch (e) {
      return serverError(e);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    accountId: string;
    surveyId: string;
  };
}

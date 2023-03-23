import { AddSurveyUsecase } from '@/domain/usecases/add-survey-usecase';
import {
  badRequest,
  created,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurveyUsecase,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;

      await this.addSurvey.add({ question, answers, createdAt: new Date() });

      return created();
    } catch (e) {
      return serverError(e);
    }
  }
}

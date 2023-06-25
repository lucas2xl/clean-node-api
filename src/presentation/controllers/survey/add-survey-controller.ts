import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';
import {
  badRequest,
  created,
  serverError,
} from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse } from '@/presentation/protocols/http';
import { Validation } from '@/presentation/protocols/validation';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurveyUsecase,
  ) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { question, answers } = request;

      await this.addSurvey.add({ question, answers, createdAt: new Date() });

      return created();
    } catch (e) {
      return serverError(e);
    }
  }
}

export namespace AddSurveyController {
  export type Request = {
    question: string;
    answers: Answer[];
  };

  type Answer = {
    image?: string;
    answer: string;
  };
}

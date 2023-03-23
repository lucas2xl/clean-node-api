import { LoadSurveysUsecase } from '@/domain/usecases/load-surveys-usecase';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse } from '@/presentation/protocols/http';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveysUsecase) {}

  async handle(): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();
      return ok(surveys);
    } catch (e) {
      return serverError(e);
    }
  }
}

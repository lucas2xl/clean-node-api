import { LoadSurveysUsecase } from '@/domain/usecases/load-surveys-usecase';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveysUsecase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load();
    return null;
  }
}

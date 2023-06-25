import { LogErrorRepository } from '@/data/protocols/database/log/log-error-repository';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse, K } from '@/presentation/protocols/http';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(request: K): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}

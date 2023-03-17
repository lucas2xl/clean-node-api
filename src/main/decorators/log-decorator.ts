import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export class LogDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.log('LogDecorator');
    }

    return httpResponse;
  }
}

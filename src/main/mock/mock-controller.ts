import { ok } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export function mockController(response: HttpRequest): Controller {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(response);
    }
  }

  return new ControllerStub();
}

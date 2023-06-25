import { ok } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols/controller';
import { HttpResponse, K } from '@/presentation/protocols/http';

export function mockController(response: K): Controller {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return ok(response);
    }
  }

  return new ControllerStub();
}

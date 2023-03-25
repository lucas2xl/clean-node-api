import { serverError } from '@/presentation/helpers/http/http-helper';
import { HttpResponse } from '@/presentation/protocols/http';

export async function mockServerError(): Promise<HttpResponse> {
  const fakeError = new Error();
  fakeError.stack = 'any-stack';
  return serverError(fakeError);
}

import { HttpRequest, HttpResponse } from '@/presentation/protocols/http';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}

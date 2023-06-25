import { HttpResponse, K } from '@/presentation/protocols/http';

export interface Middleware {
  handle(request: K): Promise<HttpResponse>;
}

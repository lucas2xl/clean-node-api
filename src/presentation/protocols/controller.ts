import { HttpResponse, K } from '@/presentation/protocols/http';

export interface Controller<T = K> {
  handle(request: T): Promise<HttpResponse>;
}

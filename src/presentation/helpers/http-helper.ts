import { HttpResponse } from '@/presentation/protocols/http';
import { ServerError } from '@/presentation/errors/server-error';

export function badRequest(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: { error: error.message },
  };
}

export function serverError(): HttpResponse {
  return {
    statusCode: 500,
    body: { error: new ServerError().message },
  };
}

export function ok(data: { [key: string]: any }): HttpResponse {
  return {
    statusCode: 200,
    body: data,
  };
}

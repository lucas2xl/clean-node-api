export interface HttpResponse {
  statusCode: number;
  body: { [key: string]: any };
}

export interface HttpRequest {
  body?: { [key: string]: any };
  headers?: { [key: string]: any };
}

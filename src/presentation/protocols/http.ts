export type HttpResponse = {
  statusCode: number;
  body: { [key: string]: any };
};

export type HttpRequest = {
  body?: { [key: string]: any };
  headers?: { [key: string]: any };
};

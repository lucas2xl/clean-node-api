type K = { [key: string]: any };

export type HttpResponse = {
  statusCode: number;
  body: K;
};

export type HttpRequest = {
  body?: K;
  headers?: K;
  params?: K;
  accountId?: string;
};

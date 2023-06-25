import { Middleware } from '@/presentation/protocols/middleware';
import { NextFunction, Request, Response } from 'express';

type ExpressReturn = {
  (request: Request, response: Response, next: NextFunction): Promise<void>;
};

export function ExpressMiddlewareAdapter(
  middleware: Middleware,
): ExpressReturn {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    const req = {
      token: request.headers?.['x-access-token'],
      ...request.headers,
    };
    const httpResponse = await middleware.handle(req);

    if (httpResponse.statusCode === 200) {
      request.accountId = httpResponse.body?.accountId;
      next();
    } else {
      response.status(httpResponse.statusCode).json({
        message: httpResponse.body.message,
      });
    }
  };
}

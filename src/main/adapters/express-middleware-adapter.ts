import { HttpRequest } from '@/presentation/protocols/http';
import { Middleware } from '@/presentation/protocols/middleware';
import { NextFunction, Request, Response } from 'express';

interface ExpressReturn {
  (request: Request, response: Response, next: NextFunction): Promise<void>;
}

export function ExpressMiddlewareAdapter(
  middleware: Middleware,
): ExpressReturn {
  return async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    const httpRequest: HttpRequest = {
      headers: request.headers,
    };

    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      request.accountId = httpRequest.body.id;
      next();
    } else {
      response.status(httpResponse.statusCode).json({
        message: httpResponse.body.message,
      });
    }
  };
}

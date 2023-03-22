import { Controller } from '@/presentation/protocols/controller';
import { HttpRequest } from '@/presentation/protocols/http';
import { Request, Response } from 'express';

interface ExpressReturn {
  (request: Request, response: Response): Promise<void>;
}

export function ExpressRouteAdapter(controller: Controller): ExpressReturn {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      response.status(httpResponse.statusCode).json({
        message: httpResponse.body.message,
      });
    }
  };
}

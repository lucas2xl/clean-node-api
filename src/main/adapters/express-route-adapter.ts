import { Controller } from '@/presentation/protocols/controller';
import { Request, Response } from 'express';
import { HttpRequest } from '@/presentation/protocols/http';

interface ExpressReturn {
  (request: Request, response: Response): Promise<void>;
}

export function ExpressRouteAdapter(controller: Controller): ExpressReturn {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: request.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
}

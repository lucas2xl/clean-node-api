import { NextFunction, Request, Response } from 'express';

export function contentType(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  response.type('json');
  next();
}

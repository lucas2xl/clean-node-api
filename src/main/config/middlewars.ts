import { bodyParser } from '@/main/middlewares/body-parser';
import { contentType } from '@/main/middlewares/content-type';
import { cors } from '@/main/middlewares/cors';
import { Express } from 'express';

export default (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};

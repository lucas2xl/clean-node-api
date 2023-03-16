import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/body-parser';

export default (app: Express): void => {
  app.use(bodyParser);
};

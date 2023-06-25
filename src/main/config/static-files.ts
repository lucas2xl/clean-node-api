import * as express from 'express';
import { resolve } from 'node:path';

export default (app: express.Express): void => {
  app.use('/static', express.static(resolve(__dirname, '../../static')));
};

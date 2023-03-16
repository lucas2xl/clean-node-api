import * as express from 'express';
import setupMiddlewares from './middlewars';

const app = express();
setupMiddlewares(app);

export default app;

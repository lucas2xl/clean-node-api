import * as express from 'express';
import setupMiddlewares from './middlewars';
import setupRoutes from './routes';

const app = express();
setupMiddlewares(app);
setupRoutes(app);

export default app;

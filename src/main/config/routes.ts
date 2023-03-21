import { Express, Router } from 'express';
import { readdirSync } from 'node:fs';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  readdirSync(`${__dirname}/../routes`).map(async file => {
    const isValidFile = new RegExp('.*\\.(ts|js)$').test(file);
    const notIncludeTypes = !file.includes('.d.ts');
    const notIncludeTests = !file.includes('e2e-spec.ts');

    if (isValidFile && notIncludeTypes && notIncludeTests) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};

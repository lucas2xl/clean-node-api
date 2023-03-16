import 'reflect-metadata';
import app from '@/main/config/app';
import env from '@/main/config/env';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

async function bootstrap() {
  await MongoHelper.connect(env.mongoUrl);

  app.listen(env.port, () =>
    console.log(`🚀 Server running at http://localhost:${env.port}`),
  );
}

bootstrap();

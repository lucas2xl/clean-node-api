import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import app from '@/main/config/app';
import env from '@/main/config/env';
import 'reflect-metadata';

async function bootstrap() {
  await MongoHelper.instance.connect(env.databaseUrl);

  app.listen(env.port, () =>
    console.log(`🚀 Server running at http://localhost:${env.port}`),
  );
}

bootstrap();

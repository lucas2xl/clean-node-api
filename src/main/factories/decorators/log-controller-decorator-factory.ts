import { LogMongoErrorRepository } from '@/infra/database/mongodb/repositories/log/log-mongo-error-repository';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { Controller } from '@/presentation/protocols/controller';

export function makeLogControllerDecorator(controller: Controller): Controller {
  const logErrorRepository = new LogMongoErrorRepository();
  return new LogControllerDecorator(controller, logErrorRepository);
}

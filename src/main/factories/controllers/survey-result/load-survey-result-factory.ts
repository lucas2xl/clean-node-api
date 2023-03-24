import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/db-load-surveys-factory';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeLoadSurveyResultControllerFactory(): Controller {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
}

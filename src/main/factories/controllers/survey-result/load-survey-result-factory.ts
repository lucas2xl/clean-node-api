import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/db-load-survey-reult-factory';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/db-load-survey-by-id-factory';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeLoadSurveyResultControllerFactory(): Controller {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
}

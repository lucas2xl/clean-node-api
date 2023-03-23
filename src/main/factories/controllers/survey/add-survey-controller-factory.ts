import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/db-add-survey-factory';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeAddSurveyControllerFactory(): Controller {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );
  return makeLogControllerDecorator(controller);
}

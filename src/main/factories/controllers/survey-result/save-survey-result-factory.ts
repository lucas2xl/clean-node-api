import { makeSaveSurveyResultValidation } from '@/main/factories/controllers/survey-result/save-survey-result-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/db-save-survey-reult-factory';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/db-load-survey-by-id-factory';
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result-controller';
import { Controller } from '@/presentation/protocols/controller';

export function makeSaveSurveyResultControllerFactory(): Controller {
  const controller = new SaveSurveyResultController(
    makeSaveSurveyResultValidation(),
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );
  return makeLogControllerDecorator(controller);
}

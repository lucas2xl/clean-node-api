import { DbSaveSurveyResult } from '@/data/usecases/survey-result/db-save-survey-result';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/repositories/survey-result/survey-result-mongo-repository';

export function makeDbSaveSurveyResult(): SaveSurveyResultUsecase {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  return new DbSaveSurveyResult(surveyResultMongoRepository);
}

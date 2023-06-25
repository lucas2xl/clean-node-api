import { DbLoadSurveyResult } from '@/data/usecases/survey-result/db-load-survey-result';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';
import { SurveyResultMongoRepository } from '@/infra/database/mongodb/repositories/survey-result/survey-result-mongo-repository';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';

export function makeDbLoadSurveyResult(): LoadSurveyResultUsecase {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository,
  );
}

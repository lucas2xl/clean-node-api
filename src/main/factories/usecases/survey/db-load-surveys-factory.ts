import { DbLoadSurveys } from '@/data/usecases/survey/db-load-surveys';
import { LoadSurveysUsecase } from '@/domain/usecases/survey/load-surveys-usecase';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';

export function makeDbLoadSurveys(): LoadSurveysUsecase {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
}

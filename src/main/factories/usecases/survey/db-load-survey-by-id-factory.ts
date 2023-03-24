import { DbLoadSurveyById } from '@/data/usecases/survey/db-load-survey-by-id';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';

export function makeDbLoadSurveyById(): LoadSurveyByIdUsecase {
  const surveyMongoRepository = new SurveyMongoRepository();

  return new DbLoadSurveyById(surveyMongoRepository);
}

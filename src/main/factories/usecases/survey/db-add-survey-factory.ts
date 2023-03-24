import { DbAddSurvey } from '@/data/usecases/survey/db-add-survey';
import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';
import { SurveyMongoRepository } from '@/infra/database/mongodb/repositories/survey/survey-mongo-repository';

export function makeDbAddSurvey(): AddSurveyUsecase {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
}

import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import {
  AddSurveyParams,
  AddSurveyUsecase,
} from '@/domain/usecases/survey/add-survey-usecase';

export class DbAddSurvey implements AddSurveyUsecase {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(surveyData);
  }
}

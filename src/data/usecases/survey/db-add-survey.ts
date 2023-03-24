import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import {
  AddSurveyModel,
  AddSurveyUsecase,
} from '@/domain/usecases/survey/add-survey-usecase';

export class DbAddSurvey implements AddSurveyUsecase {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData);
  }
}

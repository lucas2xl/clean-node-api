import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { LoadSurveyResultUsecase } from '@/domain/usecases/survey-result/load-survey-result-usecase';

export class DbLoadSurveyResult implements LoadSurveyResultUsecase {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load({
    surveyId,
    accountId,
  }: LoadSurveyResultUsecase.Params): Promise<LoadSurveyResultUsecase.Result> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId({
      surveyId,
      accountId,
    });
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById({
        id: surveyId,
      });
      surveyResult = {
        surveyId,
        question: survey.question,
        createdAt: survey.createdAt,
        answers: survey.answers.map(answer => ({
          ...answer,
          count: 0,
          percent: 0,
        })),
      };
    }

    return surveyResult;
  }
}

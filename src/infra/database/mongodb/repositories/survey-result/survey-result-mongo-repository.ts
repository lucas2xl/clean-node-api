import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  private readonly collectionName = 'surveyResults';

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await this.getCollection();

    const survey = await surveyCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: {
          answer: data.answer,
          createdAt: data.createdAt,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );

    return MongoHelper.instance.map<SurveyResultModel>(survey.value);
  }

  private async getCollection(): Promise<Collection> {
    return MongoHelper.instance.getCollection(this.collectionName);
  }
}

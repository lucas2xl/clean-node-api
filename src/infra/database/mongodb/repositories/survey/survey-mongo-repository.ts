import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey-model';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  async add(surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'surveys',
    );

    const { insertedId } = await accountCollection.insertOne(surveyData);
    await accountCollection.findOne({ _id: insertedId });
  }

  async loadAll(): Promise<SurveyModel[]> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'surveys',
    );

    return accountCollection.find().toArray();
  }
}

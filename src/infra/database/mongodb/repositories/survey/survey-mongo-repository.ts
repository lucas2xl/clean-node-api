import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    const accountCollection = await MongoHelper.instance.getCollection(
      'surveys',
    );

    const { insertedId } = await accountCollection.insertOne(surveyData);
    await accountCollection.findOne({ _id: insertedId });
  }
}

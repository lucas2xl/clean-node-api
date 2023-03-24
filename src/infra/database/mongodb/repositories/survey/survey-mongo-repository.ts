import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { SurveyModel } from '@/domain/models/survey-model';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  private readonly collectionName = 'surveys';

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await this.getCollection();

    const { insertedId } = await surveyCollection.insertOne(surveyData);
    await surveyCollection.findOne({ _id: insertedId });
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await this.getCollection();

    const survey = await surveyCollection.find().toArray();
    return MongoHelper.instance.arrayMap<SurveyModel[]>(survey);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await this.getCollection();

    const survey = await surveyCollection.findOne({ _id: id });
    return MongoHelper.instance.map<SurveyModel>(survey);
  }

  private async getCollection(): Promise<Collection> {
    return MongoHelper.instance.getCollection(this.collectionName);
  }
}

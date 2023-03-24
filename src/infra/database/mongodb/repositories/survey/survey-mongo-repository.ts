import { AddSurveyRepository } from '@/data/protocols/database/survey/add.survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/database/survey/load-surveys-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/database/survey/save-survey-result-repository';
import { SurveyModel } from '@/domain/models/survey-model';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { AddSurveyModel } from '@/domain/usecases/add-survey-usecase';
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    SaveSurveyResultRepository
{
  private readonly collectionName = 'surveys';

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    const { insertedId } = await surveyCollection.insertOne(surveyData);
    await surveyCollection.findOne({ _id: insertedId });
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    return surveyCollection.find().toArray();
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.instance.getCollection(
      this.collectionName,
    );

    return surveyCollection.findOne({ _id: id }) as unknown as SurveyModel;
  }

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Promise.resolve(undefined);
  }
}

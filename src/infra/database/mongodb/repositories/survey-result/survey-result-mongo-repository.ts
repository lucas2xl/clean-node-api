import { LoadSurveyResultRepository } from '@/data/protocols/database/survey-result/load-survey-result-repository';
import { SaveSurveyResultRepository } from '@/data/protocols/database/survey-result/save-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result-model';
import { SaveSurveyResultUsecase } from '@/domain/usecases/survey-result/save-survey-result-usecase';
import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper';
import { QueryBuilder } from '@/infra/database/mongodb/helpers/query-build';
import * as round from 'mongo-round';
import { Collection, ObjectId } from 'mongodb';

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
  private readonly collectionName = 'surveyResults';

  async save(data: SaveSurveyResultUsecase.Params): Promise<void> {
    const surveyCollection = await this.getCollection();

    await surveyCollection.findOneAndUpdate(
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
      { upsert: true },
    );
  }

  async loadBySurveyId({
    surveyId,
    accountId,
  }: LoadSurveyResultRepository.Params): Promise<LoadSurveyResultRepository.Result> {
    const surveyCollection = await this.getCollection();

    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        total: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          createdAt: '$survey.createdAt',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              { $eq: ['$data.accountId', new ObjectId(accountId)] },
              '$data.answer',
              '$invalid',
            ],
          },
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                  isCurrentAccountAnswerCount: {
                    $cond: [
                      {
                        $eq: [
                          '$$item.answer',
                          {
                            $arrayElemAt: ['$currentAccountAnswer', 0],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: 'createdAt',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: 'createdAt',
          answer: '$answers.answer',
          image: '$answers.image',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: round('$count'),
          percent: round('$percent'),
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1],
          },
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          createdAt: 'createdAt',
        },
        answers: {
          $push: '$answer',
        },
      })
      .project({
        _id: 0,
        surveyId: {
          $toString: '$_id.surveyId',
        },
        question: '$_id.question',
        createdAt: '$_id.createdAt',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyCollection
      .aggregate<SurveyResultModel>(query)
      .toArray();

    return surveyResult.length ? surveyResult[0] : null;
  }

  private async getCollection(): Promise<Collection> {
    return MongoHelper.instance.getCollection(this.collectionName);
  }
}

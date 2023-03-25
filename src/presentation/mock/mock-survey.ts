import { mockSurveyModel, mockSurveyModels } from '@/domain/mock/mock-survey';
import { SurveyModel } from '@/domain/models/survey-model';
import { AddSurveyUsecase } from '@/domain/usecases/survey/add-survey-usecase';
import { LoadSurveyByIdUsecase } from '@/domain/usecases/survey/load-survey-by-id-usecase';
import { LoadSurveysUsecase } from '@/domain/usecases/survey/load-surveys-usecase';

export function mockLoadSurveyByIdUsecase(): LoadSurveyByIdUsecase {
  class LoadSurveyByIdStub implements LoadSurveyByIdUsecase {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdStub();
}

export function mockLoadSurveysUsecase(): LoadSurveysUsecase {
  class LoadSurveyStub implements LoadSurveysUsecase {
    async load(): Promise<SurveyModel[]> {
      return mockSurveyModels();
    }
  }

  return new LoadSurveyStub();
}

export function mockAddSurveyUsecase(): AddSurveyUsecase {
  class AddSurveyStub implements AddSurveyUsecase {
    add(): Promise<void> {
      return Promise.resolve(undefined);
    }
  }

  return new AddSurveyStub();
}

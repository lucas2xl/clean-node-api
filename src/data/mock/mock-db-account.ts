import { AddAccountRepository } from '@/data/protocols/database/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/database/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/database/account/load-account-by-token-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/database/survey/load-survey-by-id-repository';
import { mockAccountModel } from '@/domain/mock/mock-account';
import { mockSurveyModel } from '@/domain/mock/mock-survey';
import { AccountModel } from '@/domain/models/account-model';
import { SurveyModel } from '@/domain/models/survey-model';

export function mockAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new AddAccountRepositoryStub();
}

export function mockLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

export function mockLoadAccountByTokenRepository(): LoadAccountByTokenRepository {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new LoadAccountByTokenRepositoryStub();
}

export function mockLoadSurveyByIdRepository(): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return mockSurveyModel();
    }
  }

  return new LoadSurveyByIdRepositoryStub();
}

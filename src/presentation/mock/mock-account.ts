import { mockAccountModel } from '@/domain/mock/mock-account';
import { AccountModel } from '@/domain/models/account-model';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';

export function mockAddAccountUsecase(): AddAccountUsecase {
  class AddAccountStub implements AddAccountUsecase {
    async add(): Promise<AccountModel> {
      return mockAccountModel();
    }
  }

  return new AddAccountStub();
}

import { AccountModel } from '@/domain/models/account-model';
import { AddAccountUsecase } from '@/domain/usecases/account/add-account-usecase';

export interface AddAccountRepository {
  add(
    accountData: AddAccountRepository.Params,
  ): Promise<AddAccountRepository.Result>;
}

export namespace AddAccountRepository {
  export type Params = AddAccountUsecase.Params;
  export type Result = AccountModel;
}

import { AccountModel } from '@/domain/models/account-model';
import { LoadAccountByTokenUsecase } from '@/domain/usecases/account/load-account-by-token-usecase';

export interface LoadAccountByTokenRepository {
  loadByToken(
    data: LoadAccountByTokenUsecase.Params,
  ): Promise<AddAccountRepository.Result>;
}

export namespace AddAccountRepository {
  export type Params = LoadAccountByTokenUsecase.Params;
  export type Result = AccountModel;
}

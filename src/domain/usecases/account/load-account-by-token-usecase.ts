import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByTokenUsecase {
  loadByToken(
    data: LoadAccountByTokenUsecase.Params,
  ): Promise<LoadAccountByTokenUsecase.Result>;
}

export namespace LoadAccountByTokenUsecase {
  export type Params = {
    token: string;
    role?: string;
  };
  export type Result = AccountModel;
}

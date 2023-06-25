import { AccountModel } from '@/domain/models/account-model';

export interface LoadAccountByEmailRepository {
  loadByEmail(
    data: LoadAccountByEmailRepository.Params,
  ): Promise<LoadAccountByEmailRepository.Result>;
}

export namespace LoadAccountByEmailRepository {
  export type Params = {
    email: string;
  };
  export type Result = AccountModel;
}

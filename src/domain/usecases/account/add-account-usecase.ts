import { AccountModel } from '@/domain/models/account-model';

export interface AddAccountUsecase {
  add(data: AddAccountUsecase.Params): Promise<AddAccountUsecase.Result>;
}

export namespace AddAccountUsecase {
  export type Params = {
    name: string;
    email: string;
    password: string;
    token?: string;
    role?: string;
  };
  export type Result = AccountModel;
}

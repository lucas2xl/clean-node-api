import { AccountModel } from '@/domain/models/account-model';

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAccountUsecase {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}

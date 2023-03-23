import { AccountModel } from '@/domain/models/account-model';

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AddAccountUsecase {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}

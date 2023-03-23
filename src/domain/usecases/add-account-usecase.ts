import { AccountModel } from '@/domain/models/account-model';

export type AddAccountModel = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export interface AddAccountUsecase {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}

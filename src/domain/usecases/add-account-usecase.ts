import { AccountModel } from '@/domain/models/account-model';

export type AddAccountModel = Omit<AccountModel, 'id'>;

export interface AddAccountUsecase {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
